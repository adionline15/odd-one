# Security Checklist

## Already applied

- Gemini credentials are read only from server-side environment variables.
- Gemini upstream error bodies are not returned to clients.
- API methods are explicitly restricted.
- User-controlled city input is validated before the news request.
- External API calls have timeouts.
- Route-guide request values are type/range checked.
- Map tile coordinates are validated.
- Dynamic alert/search text is HTML-escaped before insertion into the page.
- Repository secrets and local environment files are ignored by Git.

## Before production traffic

- Add authentication for observation submission and review.
- Add server-side authorization checks for every protected operation.
- Add IP/user rate limiting to public APIs.
- Add request IDs and structured server logs.
- Add abuse protection and payload-size limits at the edge.
- Store secrets only in the deployment secret manager.
- Add dependency/security scanning.
- Add database migrations and least-privilege DB credentials.
- Add audit logs for moderation actions.
- Add backup and restore tests.
- Add monitoring and alerting.
- Review third-party API terms and attribution requirements.
