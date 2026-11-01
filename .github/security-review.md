**Site:**
- Content-Security-Policy weakened (`unsafe-inline`, `unsafe-eval`, wildcards, new origins), or an
  inline script added outside `src/scripts/inline.mjs`, whose hash is in the policy
- HTML built from strings without escaping

**CI:**
- Secrets reachable from pull request workflows or printed in logs
- Event fields (titles, branch names) interpolated into `run:` instead of passed through `env:`
- Workflow permissions wider than the job needs
