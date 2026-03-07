# Environment Variables Reference

## Runtime / Edge
- `SUPABASE_URL`
  - Supabase project URL used by edge functions.
- `SUPABASE_SERVICE_ROLE_KEY`
  - Service key used by edge functions to call PostgREST/RPC under controlled logic.

## Operational Scripts
- `SUPABASE_PROJECT_REF`
  - Project reference used for endpoint URL composition in smoke scripts.
- `SUPABASE_ANON_KEY`
  - Anon key used by runtime smoke script calls.
- `UPH_PROPERTY_ID`
  - Property UUID for pilot smoke checks (default: UPH property).
- `UPH_LOCALE`
  - Locale used in content smoke checks (`pt-BR` default).

## Header-based Tenant Context
- `x-property-id`
  - Required request header for tenant scoping in edge functions.
  - Must be a valid UUID.

## Validation Notes
- Never trust tenant id in request body when header contract exists.
- Keep production/staging values isolated by deployment environment.
