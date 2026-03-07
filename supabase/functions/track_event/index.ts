const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-property-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface TrackEventRequest {
  event_type?: string;
  event_category?: string;
  event_label?: string;
  entity_type?: string;
  entity_id?: string;
  user_session_id?: string;
  idempotency_key?: string;
  referrer_url?: string;
  metadata?: Record<string, unknown>;
}

function getPropertyId(req: Request): string | null {
  const value = req.headers.get('x-property-id')?.trim() || null;
  return value && uuidRegex.test(value) ? value : null;
}

function asUuidOrNull(value?: string): string | null {
  if (!value) return null;
  return uuidRegex.test(value) ? value : null;
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

async function rpcGuestGuide(fnName: string, params: Record<string, unknown>, propertyId: string): Promise<any> {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: guestGuideHeaders(propertyId),
    body: JSON.stringify(params),
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

    const body = (await req.json().catch(() => ({}))) as TrackEventRequest;
    const {
      event_type: eventType,
      event_category: eventCategory,
      event_label: eventLabel,
      entity_type: entityType,
      entity_id: entityId,
      user_session_id: userSessionId,
      idempotency_key: idempotencyKey,
      referrer_url: referrerUrl,
      metadata = {},
    } = body;

    if (!eventType) {
      return new Response(JSON.stringify({ error: 'event_type is required' }), {
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

    if (!allowedEventTypes.includes(eventType)) {
      return new Response(
        JSON.stringify({ error: `Invalid event_type. Allowed: ${allowedEventTypes.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (idempotencyKey) {
      const existing = await fetchFromGuestGuide(
        `event_log?property_id=eq.${propertyId}&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&select=id,event_type,created_at&limit=1`,
        propertyId,
      );

      if (existing?.length) {
        return new Response(
          JSON.stringify({
            id: existing[0].id,
            event_type: existing[0].event_type,
            created_at: existing[0].created_at,
            is_new: false,
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
    }

    const eventId = await rpcGuestGuide(
      'track_event',
      {
        p_property_id: propertyId,
        p_event_type: eventType,
        p_event_category: eventCategory || null,
        p_event_label: eventLabel || null,
        p_entity_type: entityType || null,
        p_entity_id: asUuidOrNull(entityId),
        p_user_session_id: userSessionId || null,
        p_idempotency_key: idempotencyKey || null,
        p_referrer_url: referrerUrl || null,
        p_user_agent: req.headers.get('user-agent') || null,
        p_metadata: metadata,
      },
      propertyId,
    );

    if (!eventId) {
      throw new Error('Failed to write event');
    }

    const eventRows = await fetchFromGuestGuide(
      `event_log?id=eq.${eventId}&select=id,event_type,created_at&limit=1`,
      propertyId,
    );

    if (!eventRows?.length) {
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
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
