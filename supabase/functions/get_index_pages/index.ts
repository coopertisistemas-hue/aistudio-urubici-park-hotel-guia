const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-property-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface IndexPageRequest {
  slug?: string;
  locale?: string;
}

interface ChildPage {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  template: string;
}

interface IndexPageResponse {
  parent: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
  } | null;
  children: ChildPage[];
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

    const body = (await req.json().catch(() => ({}))) as IndexPageRequest;
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
    let parentId: string | null = null;
    let parentRouteTitle: string | null = null;

    const parentRoute = await fetchFromGuestGuide(
      `page_routes?property_id=eq.${propertyId}&slug=eq.${encodedSlug}&locale=eq.${encodedLocale}&deleted_at=is.null&select=page_id,title&limit=1`,
      propertyId,
    );

    if (parentRoute?.length) {
      parentId = parentRoute[0].page_id;
      parentRouteTitle = parentRoute[0].title || null;
    }

    if (!parentId) {
      const parentBySlug = await fetchFromGuestGuide(
        `pages?property_id=eq.${propertyId}&slug=eq.${encodedSlug}&status=eq.published&deleted_at=is.null&select=id&limit=1`,
        propertyId,
      );
      if (parentBySlug?.length) {
        parentId = parentBySlug[0].id;
      }
    }

    let parent: IndexPageResponse['parent'] = null;
    if (parentId) {
      const parentRows = await fetchFromGuestGuide(
        `pages?id=eq.${parentId}&property_id=eq.${propertyId}&status=eq.published&deleted_at=is.null&limit=1`,
        propertyId,
      );
      if (parentRows?.length) {
        parent = {
          id: parentRows[0].id,
          slug: parentRows[0].slug,
          title: parentRouteTitle || parentRows[0].title,
          description: parentRows[0].description,
        };
      }
    }

    let childRows: any[] = [];

    if (parentId) {
      childRows = await fetchFromGuestGuide(
        `pages?property_id=eq.${propertyId}&parent_id=eq.${parentId}&status=eq.published&deleted_at=is.null&order=slug.asc`,
        propertyId,
      );
    }

    if (!childRows?.length) {
      const prefix = encodeURIComponent(`${slug}/`);
      childRows = await fetchFromGuestGuide(
        `pages?property_id=eq.${propertyId}&slug=like.${prefix}%25&status=eq.published&deleted_at=is.null&order=slug.asc`,
        propertyId,
      );
    }

    const children: ChildPage[] = (childRows || []).map((page: any) => ({
      id: page.id,
      slug: page.slug,
      title: page.title,
      description: page.description,
      template: page.template,
    }));

    const response: IndexPageResponse = { parent, children };

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
