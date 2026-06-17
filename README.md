# routewright.io

The marketing site for [Routewright](https://github.com/routewright/routewright) —
a Kubernetes CNI built on standard Linux only (BGP, the kernel FIB, IPVS,
nftables; no eBPF, no overlay).

Static site built with [Hugo](https://gohugo.io), deployed to GitHub Pages at
**https://routewright.io**. Documentation lives separately at `docs.routewright.io`.

## Develop

```sh
hugo server          # live reload at http://localhost:1313
hugo --gc --minify   # production build into ./public
```

Requires Hugo (extended not strictly needed — CSS is hand-rolled, no Sass).
Pin matches CI: see `HUGO_VERSION` in `.github/workflows/deploy.yml`.

## Layout

```
hugo.toml                 site config (baseURL, GitHub repo slug, security policy)
content/_index.md         home page front matter
content/roadmap.md        roadmap page + milestone data (front matter)
layouts/index.html        the long-scroll landing page
layouts/_default/         baseof + single (roadmap) + 404
layouts/partials/         head, statusbar, footer, logo, gh-data
assets/css/main.css       the whole design system (copper/verdigris on ink)
assets/js/stats.js        scroll reveal + client-side GitHub stat refresh
data/github.json          fixture fallback for GitHub stats (pre-publish)
static/                   fonts (self-hosted IBM Plex), CNAME, og.png, favicon
```

## GitHub stats (bake + client refresh)

Repo numbers are shown two ways, layered:

- **Build time** — `layouts/partials/gh-data.html` fetches the GitHub API during
  the Hugo build and bakes a snapshot into the HTML. Works with JS disabled. A
  scheduled workflow rebuilds twice daily so the snapshot doesn't drift.
- **Client side** — `assets/js/stats.js` refreshes the volatile fields (stars,
  forks, issues) on load, overwriting the baked value. On any failure the baked
  snapshot simply remains.

Until `routewright/routewright` is public, both paths fall back to
`data/github.json` and render `—`; the numbers light up automatically once the
repo exists. No code change needed.

The build authenticates with `$GITHUB_TOKEN` to dodge the API rate limit. The
workflow uses the default `GITHUB_TOKEN` (sufficient once the repo is public);
set a `GH_STATS_TOKEN` secret only if the repo must be read while private.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml` (build → Pages). The
custom domain (`static/CNAME` = `routewright.io`) requires apex DNS `A`/`AAAA`
records pointing at GitHub Pages, plus a `www` `CNAME` — configured at the
registrar, not here.
