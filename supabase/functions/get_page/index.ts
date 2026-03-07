const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-property-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface GetPageRequest {
  slug?: string;
  locale?: string;
}

interface PageResponse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  template: string;
  blocks: ContentBlock[];
}

interface ContentBlock {
  id: string;
  block_type: string;
  block_order: number;
  title: string | null;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  metadata: Record<string, unknown>;
}

function getPropertyId(req: Request): string | null {
  const value = req.headers.get('x-property-id')?.trim() || null;
  return value && uuidRegex.test(value) ? value : null;
}

function guestGuideHeaders(propertyId: string) {
  return {
    apikey: supabaseServiceKey,
    Authorization: `Bearer ${supabaseServiceKey}`,
    'Content-Type': 'application/json',
    Prefer: 'params=schema=guest_guide',
    'Accept-Profile': 'guest_guide',
    'Content-Profile': 'guest_guide',
    'x-property-id': propertyId,
  };
}

async function fetchFromGuestGuide(endpoint: string, propertyId: string): Promise<any> {
  const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    headers: guestGuideHeaders(propertyId),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const propertyId = getPropertyId(req);
    if (!propertyId) {
      return new Response(JSON.stringify({ error: 'x-property-id header is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json().catch(() => ({}))) as GetPageRequest;
    const slug = body.slug;
    const locale = body.locale || 'pt-BR';

    if (!slug) {
      return new Response(JSON.stringify({ error: 'slug is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const encodedSlug = encodeURIComponent(slug);
    const encodedLocale = encodeURIComponent(locale);
    let pageId: string | null = null;

    const pageRoutes = await fetchFromGuestGuide(
      `page_routes?property_id=eq.${propertyId}&slug=eq.${encodedSlug}&locale=eq.${encodedLocale}&deleted_at=is.null&select=page_id&limit=1`,
      propertyId,
    );

    if (pageRoutes?.length) {
      pageId = pageRoutes[0].page_id;
    }

    if (!pageId) {
      const pagesBySlug = await fetchFromGuestGuide(
        `pages?property_id=eq.${propertyId}&slug=eq.${encodedSlug}&status=eq.published&deleted_at=is.null&select=id&limit=1`,
        propertyId,
      );

      if (!pagesBySlug?.length) {
        return new Response(JSON.stringify({ error: 'Page not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      pageId = pagesBySlug[0].id;
    }

    const [pages, blocks] = await Promise.all([
      fetchFromGuestGuide(
        `pages?id=eq.${pageId}&property_id=eq.${propertyId}&status=eq.published&deleted_at=is.null&limit=1`,
        propertyId,
      ),
      fetchFromGuestGuide(
        `content_blocks?page_id=eq.${pageId}&property_id=eq.${propertyId}&locale=eq.${encodedLocale}&deleted_at=is.null&order=block_order.asc`,
        propertyId,
      ),
    ]);

    if (!pages?.length) {
      return new Response(JSON.stringify({ error: 'Page not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const page = pages[0];
    const response: PageResponse = {
      id: page.id,
      title: page.title,
      slug: page.slug,
      description: page.description || null,
      cover_image_url: page.cover_image_url || null,
      template: page.template || 'default',
      blocks: blocks || [],
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=3600',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
