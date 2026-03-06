const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface GetPageRequest {
  property_id: string
  slug: string
  locale?: string
}

interface PageResponse {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  template: string
  blocks: ContentBlock[]
}

interface ContentBlock {
  id: string
  block_type: string
  block_order: number
  title: string | null
  content: string | null
  image_url: string | null
  video_url: string | null
  cta_label: string | null
  cta_url: string | null
  metadata: Record<string, unknown>
}

async function fetchFromPublic(endpoint: string): Promise<any> {
  const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json'
    }
  })
  if (!res.ok) {
    const err = await res.text()
    console.log('Fetch error:', res.status, err)
    return null
  }
  return res.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body: GetPageRequest = await req.json()
    const { property_id, slug, locale = 'pt-BR' } = body

    if (!property_id || !slug) {
      return new Response(
        JSON.stringify({ error: 'property_id and slug are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Buscar page pelo slug (considerando locale)
    const pageRoutes = await fetchFromPublic(
      `page_routes?property_id=eq.${property_id}&slug=eq.${slug}&locale=eq.${locale}&limit=1`
    )

    let pageId: string | null = null
    let pageData: any = null

    if (pageRoutes && pageRoutes.length > 0) {
      pageId = pageRoutes[0].page_id
      pageData = pageRoutes[0]
    }

    if (!pageId) {
      // Fallback: buscar page diretamente
      const pages = await fetchFromPublic(
        `pages?property_id=eq.${property_id}&slug=eq.${slug}&status=eq.published&limit=1`
      )

      if (!pages || pages.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Page not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      pageId = pages[0].id
      pageData = pages[0]
    }

    // Buscar blocks
    const blocks = await fetchFromPublic(
      `content_blocks?page_id=eq.${pageId}&locale=eq.${locale}&order=block_order.asc`
    )

    const response: PageResponse = {
      id: pageData.id || pageData.page_id,
      title: pageData.title || pageData.slug,
      slug: slug,
      description: pageData.description || null,
      cover_image_url: pageData.cover_image_url || null,
      template: pageData.template || 'default',
      blocks: blocks || []
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=3600'
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
