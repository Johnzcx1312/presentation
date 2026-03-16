# Global AGENT rules for this repo

- Repo goal: OpenClaw talent search strategy extension package under `search-package/`.
- Do not rewrite online resume search APIs; integrate through adapter interfaces.
- Preserve product semantics in prompt files; avoid drifting prompt intent.
- Implement schema/type constraints before business logic changes.
- Prefer tests-first or tests-with-change workflow.
- Read `search-package/README.md` and `search-package/openclaw.plugin.json` before large changes.
- Put new prompts under `search-package/skills/.../prompts/`.
- Keep user-facing JSON outputs machine-parseable and stable.
