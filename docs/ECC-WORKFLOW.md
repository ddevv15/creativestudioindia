# Working with ECC on Creative Studio India

How this project uses [ECC](https://github.com/affaan-m/ECC) as its development
harness. Written against the install that actually exists in this repo, not the
upstream README — the counts below are what `./.claude/` really contains.

**Install:** project-local, `minimal` profile, **no hooks**.

```bash
npx ecc-universal install --target claude-project --profile minimal
```

`./.claude/` is gitignored. Every developer installs it themselves; nothing ECC
writes is committed. Reinstall with the command above, check it with
`npx ecc-universal doctor --target claude-project`.

> **Do not run `/plugin install ecc@ecc`.** Stacking a plugin install on top of
> this file-copy install duplicates skills, commands and agents. One method per
> harness. If things look doubled, see [Maintenance](#maintenance).

---

## 1. The idea

ECC is not a code generator. It is a **process** wrapped around the agent, so
that the same discipline applies whether the task is a one-line fix or a new
page:

```
plan → test → implement → review → verify → remember → improve
```

The value is the gates. `/plan` refuses to write code until you confirm.
`tdd-workflow` refuses to write implementation before a failing test.
`/code-review` re-reads the diff from a fresh context, so the model that wrote
the code is not the one blessing it. Without ECC you can ask for each of these;
with ECC they are the default and skipping one is a visible decision.

---

## 2. The three surfaces

This is the part most people get wrong. ECC installs three different things and
they are invoked differently.

| Surface | Count here | What it is | How it runs |
|---|---:|---|---|
| **Commands** | 94 | Slash-command entry points, e.g. `/plan` | You type them. Runs **inline**, in your current context. |
| **Skills** | 49 | Workflow playbooks (`SKILL.md`) | Loaded into the current context when relevant. Instructions the agent follows. |
| **Agents** | 68 | Delegated subagent role prompts | Spawned in a **fresh context**. Returns a report. |

The distinction that matters in practice:

- A **skill** changes how the agent behaves *in this conversation*. It costs
  context but keeps everything you have already established.
- An **agent** starts cold. It cannot see this conversation. That is exactly why
  `code-reviewer` is an agent — a reviewer that shares the author's context
  shares the author's blind spots. It is also why delegating to an agent means
  re-explaining the task.

Rule of thumb: **skills for doing, agents for judging.**

### How a skill is put together

Every skill is one directory under `.claude/skills/<name>/`:

```
.claude/skills/tdd-workflow/
└── SKILL.md          ← frontmatter (name, description) + the playbook
```

Some carry executable helpers alongside the markdown:

```
.claude/skills/ck/
├── SKILL.md
├── commands/*.mjs    ← deterministic Node scripts
└── hooks/*.mjs       ← only run if a hook runtime is registered (ours is not)
```

The `description:` line in the frontmatter is the whole discovery mechanism —
it is what the agent matches against to decide whether a skill is relevant.
Skills are loaded lazily: the description is always visible, the body only gets
pulled in when invoked. That is why 49 skills do not cost 49 skills' worth of
context.

Note that some skills ship `hooks/` scripts. **They are inert here.** We
installed without the hook runtime, so nothing in those directories executes
automatically.

---

## 3. The flow for this project

### Anything non-trivial

```
/plan "what you want"          → restates, finds risks, grounds in our patterns,
                                  then STOPS for your confirm
  ↓  (you say yes / modify / different approach)
tdd-workflow                   → RED → GREEN → refactor
  ↓
npm run typecheck && npm run lint && npm run build
  ↓
/code-review                   → fresh-context review of the diff
  ↓
/pr                            → branch, push, open PR
```

`/plan` grounds itself by searching the codebase for the conventions it should
mirror — naming, error handling, data access, test layout — and cites them with
file references. If it cannot find a pattern it says so instead of inventing
one. That is the behavior worth protecting on this repo: the codebase has a
strong, deliberate house style (see [AGENTS.md](../AGENTS.md) and
[ui-registry.md](../ui-registry.md)) and the failure mode we care about is an
agent quietly importing generic React idioms over it.

### Smaller jobs

| Situation | Use | Why this one |
|---|---|---|
| Build or type error | `/build-fix` | Minimal diffs only; will not refactor while fixing |
| Next.js build fails | `/react-build` | Knows JSX/hydration/server-client boundary failures |
| Review a component | `/react-review` | Hooks correctness, RSC boundaries, a11y |
| Review TS generally | invoke `typescript-reviewer` | Type safety, async correctness |
| Dead code sweep | `/refactor-clean` | Runs knip/depcheck/ts-prune, then removes |
| Before shipping | `/security-scan` | AgentShield over config, secrets, permissions |
| Sanity/GROQ questions | `sanity-best-practices` | **Not ECC** — our own vendored skill, still the authority for anything Sanity |
| Long session ending | `/save-session` | Writes state so `/resume-session` can pick it up |

### What to skip

Roughly 70 of the 94 commands are for stacks this project does not use — `/go-*`,
`/rust-*`, `/kotlin-*`, `/cpp-*`, `/flutter-*`, `/python-*`, `/java-*`,
`/fastapi-*`, `/vue-review`, `/gradle-build`. Same for the agent list. Ignore
them; they cost nothing until invoked.

Also skip unless you have specifically decided you want them:

- `/multi-*` — needs the separate `ccg-workflow` runtime, which is not installed.
  These will not work.
- `/epic-*` — GitHub epic coordination; overkill for a single-developer client site.
- `/gan-*`, `/santa-loop` — adversarial multi-agent loops. Expensive, and they
  need a running app plus Playwright to evaluate against.
- `/marketing-campaign`, `/jira`, `/pm2` — not relevant here.

---

## 4. Two gaps to close before the flow actually works

Both are real, both were verified against this repo, and both are why the flow
above is currently aspirational rather than operational.

### Gap 1 — the rules are inert

ECC installed **122 rule files** into `.claude/rules/ecc/`. Claude Code does not
load `.claude/rules/` natively; rules only become "always-loaded context" when a
`CLAUDE.md` or `AGENTS.md` points at them. This project has a root
[AGENTS.md](../AGENTS.md) but **no root `CLAUDE.md`**, and nothing references the
rules directory. So all 122 files currently do nothing.

Only four packs are relevant to this stack anyway:

| Pack | Files | Covers |
|---|---:|---|
| `common` | 10 | code review, style, git, security, testing, performance |
| `typescript` | 5 | style, patterns, security, testing |
| `react` | 5 | style, hooks, patterns, security, testing |
| `web` | — | general web |

The other 19 packs (cpp, java, rust, php, swift, …) are dead weight.

**To fix:** reference the four relevant packs from the root `AGENTS.md`, and be
deliberate about it — rules are always-loaded, so every line is permanent
context cost on every request. Prefer citing specific files over whole packs.
There is a `/rules-distill` skill for compressing them.

### Gap 2 — there is no test runner

This is the bigger one. The centerpiece of the ECC loop is `tdd-workflow`, which
enforces tests-first with an 80% coverage target. This project has:

- **no** test framework — no Vitest, Jest, Playwright, or Testing Library
- **no** test files anywhere in `app/`, `components/`, or `lib/`
- npm scripts: `dev`, `build`, `start`, `lint`, `typecheck` — no `test`

So `tdd-workflow`, `/react-test`, `/test-coverage` and the `e2e-runner` agent
**cannot run today.** Until a runner is installed, the honest validation gate for
this project is:

```bash
npm run typecheck && npm run lint && npm run build
```

That is a real gate — it catches type errors, lint violations, and Next.js build
failures including bad server/client boundaries. It is not a test suite.

**To fix:** add Vitest + React Testing Library for `lib/` and component logic,
and Playwright if we want the `/gan-*` and `e2e-runner` surfaces. `/react-test`
auto-detects Vitest or Jest once one is present.

Until then: use `/plan` → implement → `typecheck/lint/build` → `/code-review`,
and be explicit that the TDD step is being skipped rather than pretending it ran.

---

## 5. Using it efficiently

**Context is the scarce resource.** ECC's whole premise is *"optimize the
context window, persist everything else."* Concretely:

- **Do not browse the catalog.** Ask for the task; the right skill gets matched
  by description. Dumping the command list into context to pick one costs more
  than the command saves.
- **Prefer skills over agents for work you are in the middle of.** An agent
  starts cold and you pay to re-explain. Use agents when the fresh context is
  the *point* — review, audit, second opinion.
- **`/context-budget`** audits what is actually eating the window (skills, MCP
  servers, rules) when sessions start feeling slow.
- **`/save-session` before a long break**, `/resume-session` after. Cheaper than
  re-deriving state.
- **One gate at a time.** Running `/code-review`, `/security-scan`,
  `/refactor-clean` and `/test-coverage` on the same small diff is mostly
  redundant work.

**Where ECC earns its keep on this repo specifically:** the confirm gate in
`/plan`, and fresh-context review. This codebase is heavily commented with
*reasoning* — why a decision was made, what the rejected alternatives were (see
`lib/content/settings.ts`, `lib/sanity/queries.ts`). That style survives only if
changes are planned before they are written and reviewed by something that did
not write them.

---

## 6. Maintenance

```bash
# health
npx ecc-universal doctor --target claude-project

# repair a broken/partial install
npx ecc-universal repair --target claude-project

# what is installed
npx ecc-universal list-installed

# remove
npx ecc-universal uninstall --dry-run
npx ecc-universal uninstall
```

Install state lives at `.claude/ecc/install-state.json`. ECC only removes files
it recorded there, so hand-edits inside `.claude/` may survive an uninstall.

**Two footguns:**

1. ECC wrote `.claude/settings.json` containing `{"includeCoAuthoredBy": false}`.
   That disables Claude Code's automatic `Co-Authored-By` trailer. Trailers must
   be written into the commit body by hand.
2. `.claude/AGENTS.md` is **ECC's own** contributor guide — it describes the ECC
   plugin, not this project. Our project instructions are the root
   [AGENTS.md](../AGENTS.md). Do not confuse them.

---

## 7. Quick reference

| I want to… | Run |
|---|---|
| Plan a feature | `/plan "description"` |
| Review a plan visually | `/plan-canvas` |
| Implement with tests | `tdd-workflow` *(blocked — see Gap 2)* |
| Fix a failing build | `/build-fix`, or `/react-build` for Next.js |
| Review my diff | `/code-review` |
| Review a component | `/react-review` |
| Remove dead code | `/refactor-clean` |
| Audit config security | `/security-scan` |
| See what's eating context | `context-budget` skill |
| Save / restore session | `/save-session`, `/resume-session` |
| Ask about ECC itself | `ecc-guide` skill |
| Anything Sanity | `sanity-best-practices` skill |
| Open a PR | `/pr` |
