const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-property-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface GetHomeConfigRequest {
  locale?: string;
}

interface VideoInfo {
  id: string | null;
  url: string | null;
  thumbnail_url: string | null;
  title: string | null;
  is_sponsored: boolean;
  sponsor_name: string | null;
}

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  icon: string | null;
}

interface StickerItem {
  id: string;
  icon: string;
  text: string;
}

interface ContactItem {
  id: string;
  name: string;
  contact_type: string;
  value: string;
  description: string | null;
  icon: string | null;
}

interface HomeConfigResponse {
  id: string;
  title: string;
  subtitle: string | null;
  logo_url: string | null;
  background_video: VideoInfo | null;
  primary_color: string | null;
  secondary_color: string | null;
  show_weather: boolean;
  show_partners: boolean;
  navigation: NavigationItem[];
  stickers: StickerItem[];
  contacts: ContactItem[];
  map_url: string | null;
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

async function resolveMapUrl(propertyId: string, locale: string): Promise<string | null> {
  const mapSlug = encodeURIComponent('links-uteis/localizacao');
  const encodedLocale = encodeURIComponent(locale);
  let pageId: string | null = null;

  const routeRows = await fetchFromGuestGuide(
    `page_routes?property_id=eq.${propertyId}&slug=eq.${mapSlug}&locale=eq.${encodedLocale}&deleted_at=is.null&select=page_id&limit=1`,
    propertyId,
  );

  if (routeRows?.length) {
    pageId = routeRows[0].page_id;
  }

  if (!pageId) {
    const pages = await fetchFromGuestGuide(
      `pages?property_id=eq.${propertyId}&slug=eq.${mapSlug}&status=eq.published&deleted_at=is.null&select=id&limit=1`,
      propertyId,
    );
    if (pages?.length) {
      pageId = pages[0].id;
    }
  }

  if (!pageId) return null;

  const blocks = await fetchFromGuestGuide(
    `content_blocks?page_id=eq.${pageId}&property_id=eq.${propertyId}&locale=eq.${encodedLocale}&block_type=eq.map&deleted_at=is.null&select=metadata&limit=1`,
    propertyId,
  );

  return blocks?.[0]?.metadata?.url || null;
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

    const body = (await req.json().catch(() => ({}))) as GetHomeConfigRequest;
    const locale = body.locale || 'pt-BR';
    const encodedLocale = encodeURIComponent(locale);

    const configs = await fetchFromGuestGuide(
      `home_configs?property_id=eq.${propertyId}&locale=eq.${encodedLocale}&deleted_at=is.null&limit=1`,
      propertyId,
    );

    if (!configs?.length) {
      return new Response(JSON.stringify({ error: 'Home config not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const homeConfig = configs[0];
    const [resolvedVideo, navigation, stickersData, contacts, mapUrl] = await Promise.all([
      rpcGuestGuide('resolve_background_video', { p_property_id: propertyId, p_locale: locale }, propertyId),
      fetchFromGuestGuide(
        `navigation_nodes?property_id=eq.${propertyId}&locale=eq.${encodedLocale}&is_visible=eq.true&parent_id=is.null&deleted_at=is.null&order=sort_order.asc`,
        propertyId,
      ),
      rpcGuestGuide('get_stickers_for_home', { p_property_id: propertyId, p_locale: locale }, propertyId),
      fetchFromGuestGuide(
        `contacts?property_id=eq.${propertyId}&deleted_at=is.null&order=sort_order.asc&select=id,name,contact_type,value,description,icon`,
        propertyId,
      ),
      resolveMapUrl(propertyId, locale),
    ]);

    const backgroundVideo: VideoInfo | null = resolvedVideo?.length
      ? {
          id: resolvedVideo[0].id ?? null,
          url: resolvedVideo[0].video_url ?? null,
          thumbnail_url: resolvedVideo[0].thumbnail_url ?? null,
          title: resolvedVideo[0].title ?? null,
          is_sponsored: resolvedVideo[0].is_sponsored ?? false,
          sponsor_name: resolvedVideo[0].sponsor_name ?? null,
        }
      : null;

    const stickers: StickerItem[] = (stickersData || []).map((item: any) => ({
      id: item.id,
      icon: item.icon || 'i',
      text: item.text || '',
    }));

    const response: HomeConfigResponse = {
      id: homeConfig.id,
      title: homeConfig.title,
      subtitle: homeConfig.subtitle,
      logo_url: homeConfig.logo_url,
      background_video: backgroundVideo,
      primary_color: homeConfig.primary_color,
      secondary_color: homeConfig.secondary_color,
      show_weather: homeConfig.show_weather,
      show_partners: homeConfig.show_partners,
      navigation: navigation || [],
      stickers,
      contacts: contacts || [],
      map_url: mapUrl,
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
