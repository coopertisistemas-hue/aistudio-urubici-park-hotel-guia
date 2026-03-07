const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-property-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

    const kpi = await rpcGuestGuide('get_kpi_summary', { p_property_id: propertyId }, propertyId);

    return new Response(JSON.stringify({ kpi }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
