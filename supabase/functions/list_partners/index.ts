const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-property-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface ListPartnersRequest {
  locale?: string;
  category?: string;
  featured_only?: boolean;
  limit?: number;
  offset?: number;
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

    const body = (await req.json().catch(() => ({}))) as ListPartnersRequest;
    const category = body.category;
    const featuredOnly = body.featured_only ?? false;
    const limit = body.limit ?? 20;
    const offset = body.offset ?? 0;

    let partnersEndpoint = `partners?property_id=eq.${propertyId}&is_active=eq.true&deleted_at=is.null&order=sort_order.asc&limit=${limit}&offset=${offset}`;
    if (featuredOnly) {
      partnersEndpoint += '&is_featured=eq.true';
    }
    if (category) {
      partnersEndpoint += `&category=eq.${encodeURIComponent(category)}`;
    }

    const partners = await fetchFromGuestGuide(partnersEndpoint, propertyId);

    if (!partners?.length) {
      return new Response(JSON.stringify({ partners: [], total: 0 }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300, s-maxage=3600',
        },
      });
    }

    const partnerIds = partners.map((partner: any) => `"${partner.id}"`).join(',');
    const [schedules, promotionsRaw] = await Promise.all([
      fetchFromGuestGuide(`partner_schedules?property_id=eq.${propertyId}&partner_id=in.(${partnerIds})`, propertyId),
      fetchFromGuestGuide(`partner_promotions?property_id=eq.${propertyId}&is_active=eq.true&deleted_at=is.null`, propertyId),
    ]);

    const now = Date.now();
    const promotions = (promotionsRaw || []).filter((promo: any) => {
      const validFrom = promo.valid_from ? new Date(promo.valid_from).getTime() : null;
      const validUntil = promo.valid_until ? new Date(promo.valid_until).getTime() : null;
      return (validFrom === null || validFrom <= now) && (validUntil === null || validUntil >= now);
    });

    const response = partners.map((partner: any) => ({
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
      schedules: (schedules || [])
        .filter((schedule: any) => schedule.partner_id === partner.id)
        .map((schedule: any) => ({
          day_of_week: schedule.day_of_week,
          open_time: schedule.open_time,
          close_time: schedule.close_time,
          is_closed: schedule.is_closed,
          notes: schedule.notes,
        })),
      promotions: promotions
        .filter((promotion: any) => promotion.partner_id === partner.id)
        .map((promotion: any) => ({
          title: promotion.title,
          description: promotion.description,
          discount_code: promotion.discount_code,
          discount_value: promotion.discount_value,
        })),
    }));

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
