# GitHub

*Written: 2026-08-23*

## Overview

GitHub — the world's largest code hosting platform. Beyond Git repositories, it provides CI/CD (Actions), project management (Issues/Projects), package registry, and collaboration tools.

---

## Core Concepts

| Concept | Purpose |
|---------|---------|
| Repository | Project container (code, history, config) |
| Branch | Isolated line of development |
| Pull Request (PR) | Propose + review + merge changes |
| Issue | Track bugs, features, tasks |
| Actions | CI/CD workflows (YAML-defined) |
| Projects | Kanban boards for planning |
| Releases | Versioned artifacts with changelogs |
| Packages | Container/package registry |

---

## GitHub CLI (gh)

### Installation

```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
sudo apt install gh

# Authenticate
gh auth login
```

### Essential Commands

| Command | Purpose |
|---------|---------|
| `gh repo clone owner/repo` | Clone repository |
| `gh repo create name --public` | Create new repo |
| `gh pr create --fill` | Create PR from current branch |
| `gh pr list` | List open PRs |
| `gh pr checkout 42` | Check out PR #42 locally |
| `gh pr merge 42 --squash` | Squash-merge PR |
| `gh issue create --title "Bug"` | Create issue |
| `gh issue list --label bug` | List bugs |
| `gh run list` | List workflow runs |
| `gh run watch` | Watch current workflow |
| `gh release create v1.0` | Create release |

---

## GitHub Actions (CI/CD)

### Basic Workflow

```yaml
# .github/workflows/ci.yml
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
      - run: pip install -r requirements.txt
      - run: pytest --tb=short
```

### Useful Actions

| Action | Purpose |
|--------|---------|
| `actions/checkout@v4` | Check out repo |
| `actions/setup-python@v5` | Install Python |
| `actions/setup-node@v4` | Install Node.js |
| `actions/cache@v4` | Cache dependencies |
| `actions/upload-artifact@v4` | Save build artifacts |
| `github/codeql-action` | Security scanning |
| `softprops/action-gh-release` | Auto-create releases |

---

## Branch Protection Rules

| Rule | Effect |
|------|--------|
| Require PR reviews | No direct push to main |
| Require status checks | CI must pass before merge |
| Require linear history | Squash or rebase only (no merge commits) |
| Require signed commits | GPG signature required |
| Restrict push access | Only specific teams can push |

---

## Tips

| Tip | How |
|-----|-----|
| Quick file edit | Press `.` on any repo page → open in web editor |
| Search code | `repo:owner/name language:python "pattern"` |
| Keyboard shortcuts | Press `?` on any GitHub page |
| Draft PRs | Create PR as draft → mark ready when done |
| Auto-close issues | PR description: `Fixes #42` or `Closes #42` |
| CODEOWNERS | `.github/CODEOWNERS` → auto-assign reviewers |
| Dependabot | `.github/dependabot.yml` → auto-update deps |
| Templates | `.github/PULL_REQUEST_TEMPLATE.md` |
