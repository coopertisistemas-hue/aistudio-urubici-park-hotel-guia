const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface IndexPageRequest {
  property_id: string;
  slug: string;
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
    const body: IndexPageRequest = await req.json();
    const { property_id, slug, locale = 'pt-BR' } = body;

    if (!property_id || !slug) {
      return new Response(JSON.stringify({ error: 'property_id and slug are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let parentId: string | null = null;
    let parentRouteTitle: string | null = null;

    const parentRoute = await fetchFromGuestGuide(
      `page_routes?property_id=eq.${property_id}&slug=eq.${slug}&locale=eq.${locale}&deleted_at=is.null&select=page_id,title&limit=1`
    );

    if (parentRoute && parentRoute.length > 0) {
      parentId = parentRoute[0].page_id;
      parentRouteTitle = parentRoute[0].title || null;
    }

    if (!parentId) {
      const parentBySlug = await fetchFromGuestGuide(
        `pages?property_id=eq.${property_id}&slug=eq.${slug}&status=eq.published&deleted_at=is.null&select=id&limit=1`
      );
      if (parentBySlug && parentBySlug.length > 0) {
        parentId = parentBySlug[0].id;
      }
    }

    let parent: IndexPageResponse['parent'] = null;
    if (parentId) {
      const parentRows = await fetchFromGuestGuide(
        `pages?id=eq.${parentId}&property_id=eq.${property_id}&status=eq.published&deleted_at=is.null&limit=1`
      );
      if (parentRows && parentRows.length > 0) {
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
      const byParent = await fetchFromGuestGuide(
        `pages?property_id=eq.${property_id}&parent_id=eq.${parentId}&status=eq.published&deleted_at=is.null&order=slug.asc`
      );
      childRows = byParent || [];
    }

    if (childRows.length === 0) {
      const prefix = encodeURIComponent(slug + '/');
      const legacy = await fetchFromGuestGuide(
        `pages?property_id=eq.${property_id}&slug=like.${prefix}%25&status=eq.published&deleted_at=is.null&order=slug.asc`
      );
      childRows = legacy || [];
    }

    const children: ChildPage[] = childRows.map((page: any) => ({
      id: page.id,
      slug: page.slug,
      title: page.title,
      description: page.description,
      template: page.template,
    }));

    const response: IndexPageResponse = {
      parent,
      children,
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
