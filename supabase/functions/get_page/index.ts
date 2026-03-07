const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface GetPageRequest {
  property_id: string;
  slug: string;
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

function guestGuideHeaders() {
  return {
    apikey: supabaseServiceKey,
    Authorization: `Bearer ${supabaseServiceKey}`,
    'Content-Type': 'application/json',
    Prefer: 'params=schema=guest_guide',
    'Accept-Profile': 'guest_guide',
    'Content-Profile': 'guest_guide',
  };
}

async function fetchFromGuestGuide(endpoint: string): Promise<any> {
  const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    headers: guestGuideHeaders(),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log('Fetch error:', res.status, err);
    return null;
  }

  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: GetPageRequest = await req.json();
    const { property_id, slug, locale = 'pt-BR' } = body;

    if (!property_id || !slug) {
      return new Response(JSON.stringify({ error: 'property_id and slug are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let pageId: string | null = null;

    const pageRoutes = await fetchFromGuestGuide(
      `page_routes?property_id=eq.${property_id}&slug=eq.${slug}&locale=eq.${locale}&deleted_at=is.null&select=page_id&limit=1`
    );

    if (pageRoutes && pageRoutes.length > 0) {
      pageId = pageRoutes[0].page_id;
    }

    if (!pageId) {
      const pagesBySlug = await fetchFromGuestGuide(
        `pages?property_id=eq.${property_id}&slug=eq.${slug}&status=eq.published&deleted_at=is.null&select=id&limit=1`
      );

      if (!pagesBySlug || pagesBySlug.length === 0) {
        return new Response(JSON.stringify({ error: 'Page not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      pageId = pagesBySlug[0].id;
    }

    const pages = await fetchFromGuestGuide(
      `pages?id=eq.${pageId}&property_id=eq.${property_id}&status=eq.published&deleted_at=is.null&limit=1`
    );

    if (!pages || pages.length === 0) {
      return new Response(JSON.stringify({ error: 'Page not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const page = pages[0];

    const blocks = await fetchFromGuestGuide(
      `content_blocks?page_id=eq.${pageId}&property_id=eq.${property_id}&locale=eq.${locale}&deleted_at=is.null&order=block_order.asc`
    );

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
