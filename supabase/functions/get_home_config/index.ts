const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface GetHomeConfigRequest {
  property_id: string;
  locale?: string;
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
  icon: string | null;
  text: string | null;
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
    const body: GetHomeConfigRequest = await req.json();
    const { property_id, locale = 'pt-BR' } = body;

    if (!property_id) {
      return new Response(JSON.stringify({ error: 'property_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const configs = await fetchFromGuestGuide(
      `home_configs?property_id=eq.${property_id}&locale=eq.${locale}&deleted_at=is.null&limit=1`
    );

    if (!configs || configs.length === 0) {
      return new Response(JSON.stringify({ error: 'Home config not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const homeConfig = configs[0];

    const resolvedVideo = await rpcGuestGuide('resolve_background_video', {
      p_property_id: property_id,
      p_locale: locale,
    });

    const backgroundVideo: VideoInfo | null = resolvedVideo && resolvedVideo.length > 0
      ? {
          id: resolvedVideo[0].id ?? null,
          url: resolvedVideo[0].video_url ?? null,
          thumbnail_url: resolvedVideo[0].thumbnail_url ?? null,
          title: resolvedVideo[0].title ?? null,
          is_sponsored: resolvedVideo[0].is_sponsored ?? false,
          sponsor_name: resolvedVideo[0].sponsor_name ?? null,
        }
      : null;

    const navigation = await fetchFromGuestGuide(
      `navigation_nodes?property_id=eq.${property_id}&locale=eq.${locale}&is_visible=eq.true&parent_id=is.null&deleted_at=is.null&order=sort_order.asc`
    );

    const stickersData = await rpcGuestGuide('get_stickers_for_home', {
      p_property_id: property_id,
      p_locale: locale,
    });

    const stickers: StickerItem[] = (stickersData || []).map((s: any) => ({
      id: s.id,
      icon: s.icon || null,
      text: s.text || null,
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
