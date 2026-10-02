# Git Workflow

BRANCHES
main = production source
agent/a01-marketing
agent/a02-dashboard
agent/a03-auth
agent/a04-map
agent/a05-roads
agent/a06-search
agent/a07-satellite
agent/a08-ai
agent/a09-alerts
agent/a10-analytics
agent/a11-api
agent/a12-database
agent/a13-ui
agent/a14-qa
agent/a15-tooling
integration/* = temporary integration branches

FLOW
agent work -> test -> commit -> push -> PR/integration -> cross-module test -> main -> production deployment

COMMIT
Use meaningful commits such as feat:, fix:, refactor:, test:, docs:, perf:, chore:.

Do not manufacture empty commits to hit a number. If the 2,000+ daily target is not naturally supported by real work, report the actual count.

MERGE
Integrate small batches. Resolve conflicts at the integration boundary, not by allowing agents to overwrite each other's owned files.
