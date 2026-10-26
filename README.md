# Aoun Ali — Cybersecurity Portfolio

Elegant, accessible, and responsive static portfolio featuring my hands-on cybersecurity projects, experience, and technical interests.

## Structure

- `index.html` — semantic page sections, SEO metadata and contact links
- `styles.css` — design tokens, layout and responsive styling
- `main.js` — single source of truth for project cards, illustration SVGs and mobile navigation
- `favicon.svg` — lightweight custom vector favicon

## Editing projects

Open `main.js` and update the `projects` array. Each entry specifies a title, summary, technologies, repository URL and diagram style. New entries automatically render using the same layout.

## Deployment

This is a zero-build static site. To publish it:
1. Merge the portfolio pull request into `main`.
2. Visit repository **Settings → Pages**.
3. Select **Deploy from a branch** → `main` → `/(root)`.
4. Open https://aounali720.github.io/Pain.github.io/

The address includes the repository name because this is a *project* Pages repository. To deploy at the shorter `aounali720.github.io` address, create or rename the repository to `aounali720.github.io` and adjust the `og:url` in `index.html`.

## Local preview

Open `index.html` directly in a browser or serve the folder using `python -m http.server 8000`.

## Accessibility and performance

- Semantic HTML and a keyboard skip link
- Accessible menu toggle with expanded state
- Responsive layouts for desktop, tablet and phones
- Respects reduced-motion preferences
- No framework, build step, or client-side third-party dependencies
- Inline lightweight SVG diagrams rendered from local project data

## Content integrity

Descriptions are based on linked repository documentation and practical lab experience. The threat modelling project is described as a guided training exercise rather than original commercial client work.
