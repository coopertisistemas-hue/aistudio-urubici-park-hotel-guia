const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface IndexPageRequest {
  property_id: string
  slug: string
  locale?: string
}

interface ChildPage {
  slug: string
  title: string
  description: string | null
  template: string
}

interface IndexPageResponse {
  parent: {
    slug: string
    title: string
    description: string | null
  } | null
  children: ChildPage[]
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
    const body: IndexPageRequest = await req.json()
    const { property_id, slug, locale = 'pt-BR' } = body

    if (!property_id || !slug) {
      return new Response(
        JSON.stringify({ error: 'property_id and slug are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get parent page info
    const parentPages = await fetchFromPublic(
      `pages?property_id=eq.${property_id}&slug=eq.${slug}&status=eq.published&limit=1`
    )

    let parent = null
    if (parentPages && parentPages.length > 0) {
      parent = {
        slug: parentPages[0].slug,
        title: parentPages[0].title,
        description: parentPages[0].description
      }
    }

    // Get child pages using URL prefix matching
    // This is a workaround since there's no parent_id column
    const prefix = slug + '/'
    const childPages = await fetchFromPublic(
      `pages?property_id=eq.${property_id}&slug=like.${encodeURIComponent(prefix)}%25&status=eq.published&order=slug.asc`
    )

    const children: ChildPage[] = (childPages || []).map((page: any) => ({
      slug: page.slug,
      title: page.title,
      description: page.description,
      template: page.template
    }))

    const response: IndexPageResponse = {
      parent,
      children
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
