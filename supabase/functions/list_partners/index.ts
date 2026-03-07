const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface ListPartnersRequest {
  property_id: string;
  locale?: string;
  category?: string;
  featured_only?: boolean;
  limit?: number;
  offset?: number;
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
    const body: ListPartnersRequest = await req.json();
    const {
      property_id,
      category,
      featured_only = false,
      limit = 20,
      offset = 0,
    } = body;

    if (!property_id) {
      return new Response(JSON.stringify({ error: 'property_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let partnersEndpoint = `partners?property_id=eq.${property_id}&is_active=eq.true&deleted_at=is.null&order=sort_order.asc&limit=${limit}&offset=${offset}`;
    if (featured_only) {
      partnersEndpoint += '&is_featured=eq.true';
    }
    if (category) {
      partnersEndpoint += `&category=eq.${category}`;
    }

    const partners = await fetchFromGuestGuide(partnersEndpoint);

    if (!partners || partners.length === 0) {
      return new Response(JSON.stringify({ partners: [], total: 0 }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=3600',
        },
      });
    }

    const partnerIds = partners.map((p: any) => p.id);

    const schedules = await fetchFromGuestGuide(
      `partner_schedules?property_id=eq.${property_id}&partner_id=in.(${partnerIds.map((id: string) => `"${id}"`).join(',')})`
    );

    const promotionsRaw = await fetchFromGuestGuide(
      `partner_promotions?property_id=eq.${property_id}&is_active=eq.true&deleted_at=is.null`
    );

    const now = Date.now();
    const promotions = (promotionsRaw || []).filter((promo: any) => {
      const validFrom = promo.valid_from ? new Date(promo.valid_from).getTime() : null;
      const validUntil = promo.valid_until ? new Date(promo.valid_until).getTime() : null;
      return (validFrom === null || validFrom <= now) && (validUntil === null || validUntil >= now);
    });

    const response = partners.map((partner: any) => {
      const partnerSchedules = (schedules || [])
        .filter((s: any) => s.partner_id === partner.id)
        .map((s: any) => ({
          day_of_week: s.day_of_week,
          open_time: s.open_time,
          close_time: s.close_time,
          is_closed: s.is_closed,
          notes: s.notes,
        }));

      const partnerPromotions = promotions
        .filter((p: any) => p.partner_id === partner.id)
        .map((p: any) => ({
          title: p.title,
          description: p.description,
          discount_code: p.discount_code,
          discount_value: p.discount_value,
        }));

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
        promotions: partnerPromotions,
      };
    });

    return new Response(JSON.stringify({ partners: response, total: partners.length }), {
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
