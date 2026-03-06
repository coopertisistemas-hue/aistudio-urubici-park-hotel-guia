import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

interface GetHomeConfigRequest {
  property_id: string
  locale?: string
}

interface HomeConfigResponse {
  id: string
  title: string
  subtitle: string | null
  logo_url: string | null
  background_video: VideoInfo | null
  primary_color: string | null
  secondary_color: string | null
  show_weather: boolean
  show_partners: boolean
  navigation: NavigationItem[]
  stickers: StickerItem[]
}

interface VideoInfo {
  id: string
  url: string
  thumbnail_url: string | null
  title: string | null
  is_sponsored: boolean
  sponsor_name: string | null
}

interface NavigationItem {
  id: string
  label: string
  url: string
  icon: string | null
}

interface StickerItem {
  id: string
  icon: string | null
  text: string | null
}

async function fetchFromGuestGuide(endpoint: string): Promise<any> {
  const res = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'params=schema=guest_guide'
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
    const body: GetHomeConfigRequest = await req.json()
    const { property_id, locale = 'pt-BR' } = body

    if (!property_id) {
      return new Response(
        JSON.stringify({ error: 'property_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Fetching config for:', { property_id, locale })

    const configs = await fetchFromGuestGuide(
      `home_configs?property_id=eq.${property_id}&locale=eq.${locale}&deleted_at=is.null&limit=1`
    )

    if (!configs || configs.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Home config not found', debug: { property_id, locale } }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const homeConfig = configs[0]

    // Buscar videos
    const videos = await fetchFromGuestGuide(
      `background_videos?property_id=eq.${property_id}&is_active=eq.true&order=is_sponsored.desc&order=sort_order.asc&limit=2`
    )

    let backgroundVideo: VideoInfo | null = null
    
    if (videos && videos.length > 0) {
      const activeVideo = videos.find((v: any) => !v.is_sponsored || videos[0]?.is_sponsored)
      if (activeVideo) {
        backgroundVideo = {
          id: activeVideo.id,
          url: activeVideo.video_url,
          thumbnail_url: activeVideo.thumbnail_url,
          title: activeVideo.title,
          is_sponsored: activeVideo.is_sponsored,
          sponsor_name: activeVideo.sponsor_name
        }
      } else if (videos.length > 1) {
        const defaultVideo = videos.find((v: any) => !v.is_sponsored)
        if (defaultVideo) {
          backgroundVideo = {
            id: defaultVideo.id,
            url: defaultVideo.video_url,
            thumbnail_url: defaultVideo.thumbnail_url,
            title: defaultVideo.title,
            is_sponsored: false,
            sponsor_name: null
          }
        }
      }

      if (!backgroundVideo?.url && homeConfig.background_video_url) {
        backgroundVideo = {
          id: homeConfig.id,
          url: homeConfig.background_video_url,
          thumbnail_url: null,
          title: null,
          is_sponsored: false,
          sponsor_name: null
        }
      } else if (!backgroundVideo?.url && homeConfig.background_video_fallback_url) {
        backgroundVideo = {
          id: homeConfig.id,
          url: homeConfig.background_video_fallback_url,
          thumbnail_url: null,
          title: null,
          is_sponsored: false,
          sponsor_name: null
        }
      }
    } else if (homeConfig.background_video_url) {
      backgroundVideo = {
        id: homeConfig.id,
        url: homeConfig.background_video_url,
        thumbnail_url: null,
        title: null,
        is_sponsored: false,
        sponsor_name: null
      }
    }

    // Buscar navegacao
    const navigation = await fetchFromGuestGuide(
      `navigation_nodes?property_id=eq.${property_id}&locale=eq.${locale}&is_visible=eq.true&parent_id=is.null&order=sort_order.asc`
    )

    // Buscar stickers (TopSticker)
    const stickers = await fetchFromGuestGuide(
      `top_sticker_messages?property_id=eq.${property_id}&status=eq.active&select=id,top_sticker_locales(icon,text)&order=sort_order.asc`
    )

    const formattedStickers: StickerItem[] = (stickers || []).map((s: any) => ({
      id: s.id,
      icon: s.top_sticker_locales?.[0]?.icon || null,
      text: s.top_sticker_locales?.[0]?.text || null
    }))

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
      stickers: formattedStickers
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
