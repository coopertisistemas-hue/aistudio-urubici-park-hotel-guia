const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface TrackEventRequest {
  property_id: string;
  event_type: string;
  event_category?: string;
  event_label?: string;
  entity_type?: string;
  entity_id?: string;
  user_session_id?: string;
  idempotency_key?: string;
  referrer_url?: string;
  metadata?: Record<string, unknown>;
}

function asUuidOrNull(value?: string): string | null {
  if (!value) return null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value) ? value : null;
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

async function rpcGuestGuide(fnName: string, params: Record<string, unknown>): Promise<any> {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: guestGuideHeaders(),
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log('RPC error:', fnName, res.status, err);
    return null;
  }

  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: TrackEventRequest = await req.json();
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
      metadata = {},
    } = body;

    if (!property_id || !event_type) {
      return new Response(JSON.stringify({ error: 'property_id and event_type are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
      'contact_click',
    ];

    if (!allowedEventTypes.includes(event_type)) {
      return new Response(
        JSON.stringify({ error: `Invalid event_type. Allowed: ${allowedEventTypes.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let existingEvent: any = null;
    if (idempotency_key) {
      const existing = await fetchFromGuestGuide(
        `event_log?property_id=eq.${property_id}&idempotency_key=eq.${idempotency_key}&select=id,event_type,created_at&limit=1`
      );
      if (existing && existing.length > 0) {
        existingEvent = existing[0];
      }
    }

    if (existingEvent) {
      return new Response(
        JSON.stringify({
          id: existingEvent.id,
          event_type: existingEvent.event_type,
          created_at: existingEvent.created_at,
          is_new: false,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userAgent = req.headers.get('user-agent') || null;

    const eventId = await rpcGuestGuide('track_event', {
      p_property_id: property_id,
      p_event_type: event_type,
      p_event_category: event_category || null,
      p_event_label: event_label || null,
      p_entity_type: entity_type || null,
      p_entity_id: asUuidOrNull(entity_id),
      p_user_session_id: user_session_id || null,
      p_idempotency_key: idempotency_key || null,
      p_referrer_url: referrer_url || null,
      p_user_agent: userAgent,
      p_metadata: metadata,
    });

    if (!eventId) {
      throw new Error('Failed to write event');
    }

    const eventRows = await fetchFromGuestGuide(
      `event_log?id=eq.${eventId}&select=id,event_type,created_at&limit=1`
    );

    if (!eventRows || eventRows.length === 0) {
      throw new Error('Event created but not retrievable');
    }

    const event = eventRows[0];

    return new Response(
      JSON.stringify({
        id: event.id,
        event_type: event.event_type,
        created_at: event.created_at,
        is_new: true,
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
