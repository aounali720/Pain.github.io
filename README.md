# Aoun Ali — Cybersecurity Portfolio

A small static site where I keep my security labs, software projects and work experience in one place.

## Structure

- `index.html` — semantic page sections, SEO metadata and contact links
- `styles.css` — design tokens, layout and responsive styling
- `main.js` — single source of truth for project cards, illustration SVGs and mobile navigation
- `favicon.svg` — lightweight custom vector favicon

## Newly featured projects

- **[SOC FIELDWORK](https://aounali720.github.io/soc-fieldwork/)** — interactive SOC analyst training game with synthetic log investigations, incident cases, visual explainers, practice exercises, and shift simulations. [Source code](https://github.com/aounali720/soc-fieldwork).
- **[PACKET//ZERO](https://github.com/aounali720/packet-zero)** — browser-based cybersecurity game with networking diagrams, 74 lessons, and eight safe simulated labs.
- **[Harbor GRC](https://github.com/aounali720/harbor-grc)** — fictional SaaS risk and control workbench connecting findings, evidence, ownership, and risk decisions.

- **[Casefile Zero](https://aounali720.github.io/Pain.github.io/casefile-zero/)** — my standalone cybersecurity learning game covering all ten OWASP Top 10:2025 risks with annotated diagrams, code comparisons, 33 inert payload specimens, 30 questions and six TTP investigations. [Source](casefile-zero/README.md).

- **[Ops Atlas](https://aounali720.github.io/ops-atlas/)** — a playable, open-source React/TypeScript training game for Git, GitHub, Docker, Kubernetes and cloud infrastructure. Includes 8 learning worlds, 40 missions, quizzes, flashcards, safe simulated terminal labs, daily quests, and a cosmetic reward system. [Source code](https://github.com/aounali720/ops-atlas).
- **[SignalForge 720](https://github.com/aounali720/signalforge-720)** — a local Python/Streamlit SOC practice dashboard for public advisory triage, declared lab-inventory CVE matching, investigation notes, detection worksheets and evidence exports. Its offline sample cases are explicitly fictional. [Demo walkthrough](https://github.com/aounali720/signalforge-720/blob/main/docs/demo-walkthrough.md).

The illustrations are SVGs in `main.js`, so the site doesn't need a separate image service.

## Editing projects

Open `main.js` and update the `projects` array. Each entry specifies a title, summary, technologies, repository URL and diagram style. Project cards are also pre-rendered in `index.html` as a fallback, so the portfolio still shows the projects when JavaScript is disabled or blocked. When changing the project list, update both the `projects` array and the corresponding static HTML cards.

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
