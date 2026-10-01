# Security Checklist

## Already applied

- Gemini credentials are read only from server-side environment variables.
- Gemini upstream error bodies are not returned to clients.
- API methods are explicitly restricted.
- User-controlled city input is validated before the news request.
- External API calls have timeouts.
- Observation viewport requests are bounded and validated server-side.
- Observation summary requests are separately bounded and read approved data only.
- Observation metadata is size-limited at both API and database layers.
- Route-guide request values are type/range checked.
- Map tile coordinates are validated.
- Dynamic alert/search text is HTML-escaped before insertion into the page.
- Repository secrets and local environment files are ignored by Git.
- Observation database credentials are server-side only.
- Privileged observation RPC functions are executable only by the server-side service role.
- Observation submission is disabled by default.
- Observation records use a pending/approved/rejected lifecycle.
- API responses set defensive content-type, framing, and referrer headers where applicable.
- Summary responses use short-lived cache headers because they reflect changing approved data.
- The frontend ignores stale observation responses and cancels superseded viewport requests.
- Public observation reads are limited to approved records.

## Before enabling public submissions

- Add user authentication.
- Bind `created_by` to the authenticated user.
- Add server-side authorization checks for review operations.
- Add IP/user rate limiting.
- Add CAPTCHA/abuse protection if anonymous submission is ever allowed.
- Add request IDs and structured server logs.
- Add payload-size limits at the edge.
- Store secrets only in the deployment secret manager.
- Add dependency/security scanning.
- Add audit logs for moderation actions.
- Add backup and restore tests.
- Add monitoring and alerting.
- Review third-party API terms and attribution requirements before production scale.
- Keep provider attribution visible wherever required by the selected map or geospatial provider.


## Secret boundary

Privileged Supabase credentials and AI provider keys remain server-side. Browser code must use public, non-privileged endpoints.
