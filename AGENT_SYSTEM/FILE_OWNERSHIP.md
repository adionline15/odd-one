# File Ownership

Initial logical ownership. Before implementation, the Lead Agent must reconcile this with the repository's actual tree.

A01 Marketing: marketing/ and public marketing assets
A02 Dashboard: dashboard/
A03 Auth: auth/
A04 Map: map/
A05 Roads: roads/
A06 Search: search/
A07 Satellite: satellite/
A08 AI/ML: ai/
A09 Alerts: alerts/
A10 Analytics: analytics/
A11 API/Services: api/ and services/
A12 Database: db/ and database/
A13 UI System: components/ui/ and design tokens
A14 QA: tests/ and test tooling
A15 Tooling/Docs: docs/, scripts/, developer tooling

SHARED CONTRACTS
contracts/, shared types, API schemas, and global configuration require Lead coordination.

OWNERSHIP RULE
An agent may read any repository file, but may write only owned paths unless the Lead explicitly authorizes a cross-boundary change.

IMPORTANT
These logical names are a coordination map, not a claim that every directory already exists. Agents must adapt to the actual repository structure without moving unrelated code.
