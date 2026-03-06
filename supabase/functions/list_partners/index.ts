const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface ListPartnersRequest {
  property_id: string
  locale?: string
  category?: string
  featured_only?: boolean
  limit?: number
  offset?: number
}

interface PartnerResponse {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  cover_image_url: string | null
  website_url: string | null
  phone: string | null
  email: string | null
  address: string | null
  category: string | null
  is_featured: boolean
  schedules: PartnerSchedule[]
  promotions: PartnerPromotion[]
}

interface PartnerSchedule {
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
  notes: string | null
}

interface PartnerPromotion {
  title: string
  description: string | null
  discount_code: string | null
  discount_value: string | null
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
    const body: ListPartnersRequest = await req.json()
    const { 
      property_id, 
      locale = 'pt-BR', 
      category, 
      featured_only = false,
      limit = 20,
      offset = 0
    } = body

    if (!property_id) {
      return new Response(
        JSON.stringify({ error: 'property_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build query for partners
    let partnersEndpoint = `partners?property_id=eq.${property_id}&is_active=eq.true&order=sort_order.asc&limit=${limit}&offset=${offset}`
    if (featured_only) {
      partnersEndpoint += '&is_featured=eq.true'
    }
    if (category) {
      partnersEndpoint += `&category=eq.${category}`
    }

    const partners = await fetchFromPublic(partnersEndpoint)

    if (!partners || partners.length === 0) {
      return new Response(
        JSON.stringify({ partners: [], total: 0 }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=300, s-maxage=3600'
          } 
        }
      )
    }

    // Buscar schedules e promotions
    const partnerIds = partners.map((p: any) => p.id)

    const schedules = await fetchFromPublic(
      `partner_schedules?partner_id=in.(${partnerIds.map((id: string) => `"${id}"`).join(',')})`
    )

    const now = new Date().toISOString()
    const promotions = await fetchFromPublic(
      `partner_promotions?property_id=eq.${property_id}&is_active=eq.true&or=(valid_from.is.null,valid_from.lte.${now})&or=(valid_until.is.null,valid_until.gte.${now})`
    )

    // Montar resposta
    const response = partners.map((partner: any) => {
      const partnerSchedules = (schedules || [])
        .filter((s: any) => s.partner_id === partner.id)
        .map((s: any) => ({
          day_of_week: s.day_of_week,
          open_time: s.open_time,
          close_time: s.close_time,
          is_closed: s.is_closed,
          notes: s.notes
        }))

      const partnerPromotions = (promotions || [])
        .filter((p: any) => p.partner_id === partner.id)
        .map((p: any) => ({
          title: p.title,
          description: p.description,
          discount_code: p.discount_code,
          discount_value: p.discount_value
        }))

      return {
        id: partner.id,
        name: partner.name,
        slug: partner.slug,
        description: partner.description,
        logo_url: partner.logo_url,
        cover_image_url: partner.cover_image_url,
        website_url: partner.website_url,
        phone: partner.phone,
        email: partner.email,
        address: partner.address,
        category: partner.category,
        is_featured: partner.is_featured,
        schedules: partnerSchedules,
        promotions: partnerPromotions
      }
    })

    return new Response(
      JSON.stringify({ partners: response, total: partners.length }),
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
