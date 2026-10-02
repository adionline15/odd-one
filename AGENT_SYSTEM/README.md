# Odd-One Multi-Agent System

This directory defines the operating system for parallel AI-agent development on Odd-One.

## Goals
- 15 specialized agents with isolated ownership.
- Minimum target: 2,000+ meaningful commits/day when the workload supports it.
- Prevent cross-agent file collisions.
- Integrate continuously instead of one giant end-of-project merge.
- Keep production deployment separate from commit volume.

## Start
1. Read `LEAD_AGENT.md`.
2. Read `FILE_OWNERSHIP.md`.
3. Read the assigned agent prompt.
4. Work only inside owned paths.
5. Test before handoff.
6. Commit meaningful changes and push the agent branch.
7. Integration happens through the integration branch and QA.

Never create empty/artificial commits.
