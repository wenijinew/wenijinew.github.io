# GitHub

A practical reference for GitHub features, workflows, and the `gh` CLI. For GitHub Pages specifics, see [pages](pages.md).

## Repositories

| Concept | Description |
|---------|-------------|
| Public repo | Visible to everyone, forkable |
| Private repo | Access controlled by owner/org |
| Template repo | Used as a starting point for new repos (Settings → Template repository) |
| Fork | Server-side copy under your account — used for contributing to others' projects |
| Mirror | Read-only copy synced from upstream |

### Repository best practices

- Always include `README.md`, `.gitignore`, and `LICENSE`
- Use branch protection rules on `main` — require PR reviews and status checks
- Enable Dependabot for security updates
- Add `CODEOWNERS` file for automatic review assignments

## Branches and Pull Requests

### Branch workflow

```bash
# Create feature branch
git checkout -b feature/add-pagination

# Push and set upstream
git push -u origin feature/add-pagination

# Create PR from command line
gh pr create --title "Add pagination" --body "Implements offset/limit"
```

### Pull Request lifecycle

1. **Draft PR** — open early for visibility, mark as draft
2. **Review** — request reviewers, respond to comments
3. **CI passes** — all status checks green
4. **Merge** — squash, merge commit, or rebase (project preference)

### Merge strategies

| Strategy | When to use |
|----------|-------------|
| Squash and merge | Feature branches with messy history |
| Merge commit | Preserve full branch history |
| Rebase and merge | Linear history, clean commits |

## GitHub Actions

CI/CD built into GitHub. Workflows live in `.github/workflows/`.

### Minimal workflow example

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -e ".[dev]"
      - run: pytest
```

### Key concepts

| Concept | Description |
|---------|-------------|
| Workflow | YAML file defining automation pipeline |
| Job | Set of steps running on one runner |
| Step | Single command or action |
| Action | Reusable unit (e.g., `actions/checkout@v4`) |
| Secret | Encrypted variable (Settings → Secrets) |
| Matrix | Run job across multiple configurations |
| Artifact | Files persisted between jobs |

## Issues and Projects

### Issues

- Use templates (`.github/ISSUE_TEMPLATE/`) for consistent bug reports and feature requests
- Labels categorize issues: `bug`, `enhancement`, `good first issue`
- Milestones group issues into releases
- Close issues from commits: `Fixes #42` in commit message

### GitHub Projects (v2)

- Kanban boards with custom fields (status, priority, sprint)
- Views: board, table, roadmap
- Automation: auto-add issues, auto-move on close
- Link to repository issues and PRs

## GitHub CLI (`gh`)

The official CLI for GitHub — faster than the web UI for common tasks.

```bash
# Install
brew install gh          # macOS
sudo apt install gh      # Debian/Ubuntu

# Authenticate
gh auth login

# Common commands
gh repo clone owner/repo
gh pr create --fill              # Auto-fill title/body from commits
gh pr list --state open
gh pr checkout 123               # Fetch and switch to PR branch
gh pr merge 123 --squash
gh issue create --title "Bug" --label bug
gh issue list --assignee @me
gh run list                      # View workflow runs
gh run watch                     # Live-tail a running workflow
gh release create v1.0.0 --generate-notes
```

### Useful `gh` patterns

```bash
# Review a PR in terminal
gh pr diff 123

# Check CI status of current branch
gh pr checks

# Open current repo in browser
gh browse

# Create repo from template
gh repo create my-new-repo --template owner/template-repo
```

## Tips

- **Signed commits**: `git config commit.gpgsign true` — shows "Verified" badge on commits
- **GitHub search**: `is:issue is:open label:bug` — powerful search syntax across repos
- **Notifications**: filter aggressively — watch only repos you contribute to
- **`.github/` repo**: create a profile README and default community health files
- **Keyboard shortcuts**: press `?` on any GitHub page to see available shortcuts
- **Code navigation**: click any symbol in source view for jump-to-definition (supported languages)
- **Permalinks**: press `y` on a file view to get a commit-pinned URL (won't break if file changes)

---

*Last updated: 2026-08-23*
