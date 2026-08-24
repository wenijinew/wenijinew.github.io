# GitHub Pages

*Written: 2026-08-23*

## Overview

GitHub Pages — free static site hosting directly from a GitHub repository. Supports custom domains, HTTPS, and automated deployment via Actions.

---

## Setup Options

| Method | Source | Best for |
|--------|--------|----------|
| Deploy from branch | `gh-pages` branch or `docs/` folder | Simple static sites |
| GitHub Actions | Custom workflow | Build tools (MkDocs, Hugo, Jekyll) |

### Enable Pages

```
Repository → Settings → Pages → Source:
    ├── Deploy from a branch: select gh-pages / root
    └── GitHub Actions: use custom workflow
```

---

## Deployment with MkDocs

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy-docs.yml
name: Deploy MkDocs
on:
  push:
    branches: [main]
    paths: ['docs/**', 'mkdocs.yml']

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0      # full history for git-revision-date plugin

      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: pip install mkdocs-material

      - name: Deploy
        run: mkdocs gh-deploy --force
```

### Manual Deployment

```bash
# One command: build + push to gh-pages branch
mkdocs gh-deploy

# Or with custom commit message
mkdocs gh-deploy -m "Deploy: updated AI articles"
```

---

## Custom Domain

### Setup

1. Add `CNAME` file in `docs/` (or repo root):
   ```
   notes.brucewen.dev
   ```

2. Configure DNS:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | `username.github.io` |
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |

3. Enable HTTPS in repository Settings → Pages → Enforce HTTPS ✓

---

## Project vs User/Org Sites

| Type | Repository name | URL |
|------|----------------|-----|
| User/Org site | `username.github.io` | `https://username.github.io` |
| Project site | Any name | `https://username.github.io/repo-name` |

---

## Jekyll vs Static Generators

| Aspect | Jekyll (default) | MkDocs / Hugo / Other |
|--------|------------------|-----------------------|
| Built-in support | Yes (no Actions needed) | Needs Actions workflow |
| Build speed | Slow (Ruby) | Fast (Python/Go) |
| Themes | Jekyll themes | Any theme |
| Flexibility | Limited | Full control |
| `.nojekyll` | Not needed | Required (empty file in output root) |

!!! tip "Disable Jekyll processing"
    If using MkDocs or any non-Jekyll generator, add an empty `.nojekyll` file to the deploy branch root to prevent GitHub from running Jekyll.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 on subpages | Missing `.nojekyll` | Add empty `.nojekyll` to gh-pages root |
| CSS/JS not loading | Wrong `site_url` in mkdocs.yml | Set to `https://username.github.io/repo/` |
| Custom domain resets | CNAME file missing from source | Add `CNAME` to `docs/` directory |
| Build fails | Wrong Python/Node version | Pin version in workflow |
| Changes not visible | Cache | Hard refresh (Ctrl+Shift+R) or wait 5 min |
| Branch not deploying | Wrong source branch | Check Settings → Pages → Source |
