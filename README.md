# sepiabox-site

The public website at [sepiabox.com](https://sepiabox.com): what Sepiabox is and how it works.

It is a static site published with GitHub Pages. The app itself lives at `app.sepiabox.com` and its code is in [sepiabox-platform](https://github.com/sepiabox/sepiabox-platform).

## Status

A single static page in Portuguese (`index.html`, `styles.css`), desktop first, that still reads well on a phone. Pushes to `main` deploy it to GitHub Pages; `CNAME` points it at `sepiabox.com`.

Before it is live, a person has to:

1. Enable GitHub Pages for this repository with **GitHub Actions** as the source (Settings → Pages).
2. Point the domain at GitHub Pages in GoDaddy DNS: `A` records for `@` to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and a `CNAME` for `www` to `sepiabox.github.io`.
3. Tick **Enforce HTTPS** once the certificate has been issued.

## Development

```bash
npm ci
npm run lint     # html-validate
npm test         # Playwright: sections exist, no horizontal scroll at 375 px
npm run serve    # http://127.0.0.1:4173
```

## License

The site's code is released under the [MIT License](LICENSE). The Sepiabox name and logo are not covered by it; see [sepiabox-brand](https://github.com/sepiabox/sepiabox-brand).
