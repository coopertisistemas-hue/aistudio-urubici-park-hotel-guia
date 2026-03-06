const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface TrackEventRequest {
  property_id: string
  event_type: string
  event_category?: string
  event_label?: string
  entity_type?: string
  entity_id?: string
  user_session_id?: string
  idempotency_key?: string
  referrer_url?: string
  metadata?: Record<string, unknown>
}

interface TrackEventResponse {
  id: string
  event_type: string
  created_at: string
  is_new: boolean
}

async function fetchFromPublic(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
  const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    method,
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    const err = await res.text()
    console.log('Fetch error:', res.status, err)
    return { error: err }
  }
  return method === 'GET' ? res.json() : res.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body: TrackEventRequest = await req.json()
    const { 
      property_id, 
      event_type, 
      event_category, 
      event_label,
      entity_type,
      entity_id,
      user_session_id,
      idempotency_key,
      referrer_url,
      metadata = {}
    } = body

    if (!property_id || !event_type) {
      return new Response(
        JSON.stringify({ error: 'property_id and event_type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validar event_type permitido
    const allowedEventTypes = [
      'page_view',
      'partner_view',
      'cta_click',
      'video_impression',
      'video_start',
      'video_complete',
      'promotion_view',
      'promotion_click',
      'navigation_click',
      'search',
      'contact_click'
    ]

    if (!allowedEventTypes.includes(event_type)) {
      return new Response(
        JSON.stringify({ error: `Invalid event_type. Allowed: ${allowedEventTypes.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Obter org_id a partir da property
    const property = await fetchFromPublic(`properties?id=eq.${property_id}&select=org_id&limit=1`)

    if (!property || property.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Property not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const orgId = property[0].org_id

    // Verificar idempotencia se key fornecida
    let isNew = true
    let eventId: string

    if (idempotency_key) {
      const existing = await fetchFromPublic(
        `event_log?property_id=eq.${property_id}&idempotency_key=eq.${idempotency_key}&limit=1`
      )

      if (existing && existing.length > 0) {
        isNew = false
        eventId = existing[0].id
        return new Response(
          JSON.stringify({
            id: eventId,
            event_type,
            created_at: existing[0].created_at,
            is_new: false
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Criar evento
    const eventData = {
      property_id,
      org_id: orgId,
      event_type,
      event_category,
      event_label,
      entity_type,
      entity_id,
      user_session_id,
      idempotency_key,
      referrer_url,
      metadata
    }

    const result = await fetchFromPublic('event_log', 'POST', eventData)

    if (result.error) {
      throw new Error(result.error)
    }

    const event = result[0]

    return new Response(
      JSON.stringify({
        id: event.id,
        event_type: event.event_type,
        created_at: event.created_at,
        is_new: true
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
