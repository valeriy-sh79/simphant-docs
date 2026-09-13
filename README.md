# SimPhant Documentation Site

This repository contains a multilingual Docusaurus documentation site for SimPhant.

## Content Sources

- The Docusaurus-rendered English guide is split across `docs/*.md`.
- The localized Russian guide is split across `i18n/ru/docusaurus-plugin-content-docs/current/*.md`.
- The localized Ukrainian guide is split across `i18n/uk/docusaurus-plugin-content-docs/current/*.md`.

## Commands

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run start
```

This serves the default locale with live reload.

Run the Russian development server with live reload:

```bash
npm run start:ru
```

Run the Ukrainian development server with live reload:

```bash
npm run start:uk
```

Create a production build:

```bash
npm run build
```

Serve the production build locally:

```bash
npm run serve
```

Build and serve both locales together for final preview and language-switch testing:

```bash
npm run preview:all
```

Use after updating the source Word-exported markdown files:

```bash
npm run sync-docs
```

If a dev run ever gets into a bad state, run npm run clear and start again:

```bash
npm run clear
```

## Deployment

- Repository: `https://github.com/valeriy-sh79/simphant-docs`
- Published site: `https://valeriy-sh79.github.io/simphant-docs/`

This site is configured for GitHub Pages deployment through GitHub Actions. After the repository Pages source is set to **GitHub Actions**, each push to the `main` branch will build and publish the latest documentation automatically.

## Notes

- The site is configured for three locales: English (`en`), Russian (`ru`), and Ukrainian (`uk`).
- `npm run start`, `npm run start:ru`, and `npm run start:uk` each serve one locale at a time, which is why the locale dropdown does not fully work there. Use `npm run preview:all` to test active-page language switching across all locales.
- If `npm run start` or `npm run start:ru` behaves unexpectedly after a failed run, stop the dev server and run `npm run clear` before starting it again.
- Mathematical notation is rendered with KaTeX.
- The deployment target is GitHub Pages for the `simphant-docs` repository. If you later move to a custom domain, update `url` and `baseUrl` in `docusaurus.config.js` accordingly.
