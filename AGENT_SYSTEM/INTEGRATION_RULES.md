# Integration Rules

1. Integration starts from current main.
2. Bring in one coherent agent batch at a time.
3. Run affected tests after every batch.
4. Run cross-module tests before main.
5. If a contract changes, update dependent agents before merging.
6. Never silently discard another agent's changes.
7. Prefer squash/rebase only when it preserves useful history and does not hide required audit information.
8. Production deployment follows a validated main state, not every individual commit.
