#!/usr/bin/env node

const projectRef = process.env.SUPABASE_PROJECT_REF || 'oravqykjpgqoiidqnfja';
const anonKey = process.env.SUPABASE_ANON_KEY;
const propertyId = process.env.UPH_PROPERTY_ID || '22222222-2222-2222-2222-222222222222';
const locale = process.env.UPH_LOCALE || 'pt-BR';

if (!anonKey) {
  console.error('[staging-smoke] Missing SUPABASE_ANON_KEY env var');
  process.exit(1);
}

const baseUrl = `https://${projectRef}.supabase.co/functions/v1`;

function asJson(value) {
  return JSON.stringify(value, null, 2);
}

async function callEdge(functionName, payload) {
  const res = await fetch(`${baseUrl}/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${anonKey}`,
      'x-property-id': propertyId,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(`${functionName} failed (${res.status}): ${asJson(data)}`);
  }

  return data;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const startedAt = new Date().toISOString();
  const samples = {};

  const home = await callEdge('get_home_config', { locale });
  assert(home && typeof home.title === 'string', 'get_home_config missing title');
  assert(Array.isArray(home.navigation), 'get_home_config missing navigation array');
  samples.home = {
    title: home.title,
    navigation_count: home.navigation.length,
    stickers_count: Array.isArray(home.stickers) ? home.stickers.length : 0,
    has_background_video: Boolean(home.background_video?.url),
  };

  const pageSlug =
    (home.navigation || []).find((item) => typeof item.url === 'string' && item.url.startsWith('/'))?.url?.replace(/^\//, '') ||
    'sua-estadia/check-in';

  const detail = await callEdge('get_page', { locale, slug: pageSlug });
  assert(detail && typeof detail.title === 'string', 'get_page missing title');
  assert(Array.isArray(detail.blocks), 'get_page missing blocks array');
  samples.detail = {
    slug: pageSlug,
    title: detail.title,
    blocks_count: detail.blocks.length,
  };

  const indexSlug =
    (home.navigation || []).find((item) => typeof item.url === 'string' && /^\/[^/]+$/.test(item.url))?.url?.replace(/^\//, '') ||
    'sua-estadia';

  const indexData = await callEdge('get_index_pages', { locale, slug: indexSlug });
  assert(indexData && Array.isArray(indexData.children), 'get_index_pages missing children array');
  samples.index = {
    slug: indexSlug,
    parent_title: indexData.parent?.title || null,
    children_count: indexData.children.length,
  };

  const partners = await callEdge('list_partners', { locale, limit: 5, offset: 0, featured_only: false });
  assert(partners && Array.isArray(partners.partners), 'list_partners missing partners array');
  samples.partners = {
    total: Number.isFinite(partners.total) ? partners.total : partners.partners.length,
    returned: partners.partners.length,
  };

  const idempotencyKey = `ops-smoke-${Date.now()}`;
  const eventPayload = {
    event_type: 'page_view',
    event_category: 'ops_smoke',
    event_label: 'staging-validation',
    entity_type: 'page',
    entity_id: detail.id || null,
    idempotency_key: idempotencyKey,
    metadata: {
      source: 'phase-2-smoke',
      locale,
      slug: pageSlug,
    },
  };

  const eventFirst = await callEdge('track_event', eventPayload);
  assert(eventFirst && typeof eventFirst.id === 'string', 'track_event missing id');

  const eventSecond = await callEdge('track_event', eventPayload);
  assert(eventSecond && typeof eventSecond.id === 'string', 'track_event second call missing id');

  samples.events = {
    first_id: eventFirst.id,
    second_id: eventSecond.id,
    idempotent_reused_id: eventFirst.id === eventSecond.id,
    first_is_new: eventFirst.is_new,
    second_is_new: eventSecond.is_new,
  };

  const summary = {
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    project_ref: projectRef,
    property_id: propertyId,
    locale,
    samples,
  };

  console.log(asJson(summary));
}

main().catch((error) => {
  console.error(`[staging-smoke] ${error.message}`);
  process.exit(1);
});