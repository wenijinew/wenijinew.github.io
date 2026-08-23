# GitHub Pages

Host static websites directly from a GitHub repository — free, with HTTPS and custom domain support.

## Setup

### User/Organization site

- Repository must be named `<username>.github.io`
- Content served from the default branch (usually `main`)
- URL: `https://<username>.github.io`

### Project site

- Any repository can have a Pages site
- URL: `https://<username>.github.io/<repo-name>`
- Configure in **Settings → Pages**

### Source options

| Source | Description |
|--------|-------------|
| Deploy from a branch | Serve static files from `main` or `gh-pages` branch |
| GitHub Actions | Custom build + deploy workflow (recommended for SSGs) |

## Static Site Generators

### Jekyll (GitHub's built-in)

- Zero configuration needed — GitHub builds Jekyll sites automatically
- Add a `_config.yml` for customization
- Supports themes via `remote_theme` in config
- Limitation: restricted plugin set (only GitHub-approved gems)

### MkDocs, Hugo, Astro, etc.

- Use GitHub Actions for build step
- Output to `gh-pages` branch or use Actions deployment
- Full control over build process and plugins

### Jekyll vs custom SSG

| Factor | Jekyll (built-in) | Custom (via Actions) |
|--------|-------------------|---------------------|
| Setup effort | Minimal | Requires workflow file |
| Plugin freedom | Limited to GitHub allowlist | Unrestricted |
| Build speed | Slow for large sites | Depends on SSG choice |
| Ruby dependency | Yes | No (use any language) |

## Deployment with GitHub Actions

### MkDocs example

```yaml
name: Deploy to Pages
on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - run: pip install mkdocs-material

      - run: mkdocs gh-deploy --force
```

### Hugo example

```yaml
name: Deploy Hugo
on:
  push:
    branches: [main]

permissions:
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
      - run: hugo --minify
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

## Custom Domains

### DNS configuration

| Record type | Host | Value | Use case |
|-------------|------|-------|----------|
| `CNAME` | `www` | `<username>.github.io.` | Subdomain (`www.example.com`) |
| `A` | `@` | `185.199.108.153` | Apex domain (`example.com`) |
| `A` | `@` | `185.199.109.153` | Apex domain (redundancy) |
| `A` | `@` | `185.199.110.153` | Apex domain (redundancy) |
| `A` | `@` | `185.199.111.153` | Apex domain (redundancy) |
| `AAAA` | `@` | `2606:50c0:8000::153` | IPv6 apex |

### Steps

1. Add DNS records at your registrar (Google Domains, Cloudflare, etc.)
2. In repo **Settings → Pages → Custom domain**, enter your domain
3. Check **Enforce HTTPS** (available after DNS propagation)
4. Add a `CNAME` file in the repo root containing your domain name

### Verify your domain

Go to **Settings → Pages → Verified domains** (at the organization level) to prevent others from hijacking your custom domain.

## Project structure for static sites

```
my-site/
├── docs/                  # Content (if using MkDocs)
│   └── index.md
├── .github/
│   └── workflows/
│       └── deploy.yml     # Build + deploy workflow
├── mkdocs.yml             # SSG config
├── CNAME                  # Custom domain (auto-created by GitHub UI)
└── .nojekyll              # Skip Jekyll processing (for non-Jekyll sites)
```

!!! tip "The `.nojekyll` file"
    If you're NOT using Jekyll, add an empty `.nojekyll` file to the root of your publishing source. This prevents GitHub from processing your site through Jekyll, which can break CSS/JS paths starting with `_`.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| 404 after deploy | Check publishing source branch and directory in Settings → Pages |
| CSS/JS not loading | Add `.nojekyll` file; check `site_url` in your SSG config |
| Custom domain not working | Wait 24h for DNS propagation; verify CNAME record points to `<user>.github.io.` |
| HTTPS not available | Enforce HTTPS only appears after DNS is verified — remove and re-add domain |
| Build failing | Check Actions tab for error logs; run build locally first |
| Old content showing | GitHub Pages caches aggressively — append `?v=2` to test, or wait 10 minutes |
| Subpath routing broken | For SPAs, add a `404.html` that redirects to `index.html` |

## Tips

- Use `gh-pages` branch for build output — keeps source and output separate
- Enable **Enforce HTTPS** always (free TLS via Let's Encrypt)
- For private repos on free plans, Pages sites are still public
- GitHub Pages has a soft limit of 1 GB per site and 100 GB bandwidth/month
- Deploy previews: use Netlify or Vercel for PR preview deployments (Pages doesn't support this natively)
- Multiple sites: user site at `username.github.io`, project sites at `username.github.io/repo`

---

*Last updated: 2026-08-23*
