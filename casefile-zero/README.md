# CASEFILE / ZERO

A standalone, browser-based cybersecurity learning game. It uses **OWASP Top 10:2025** for web-application risk categories and MITRE ATT&CK terminology for tactics, techniques, and procedures.

**Play:** https://aounali720.github.io/Pain.github.io/casefile-zero/

This is a separate application from StackBound Academy. It lives in its own folder on the portfolio's GitHub Pages site for immediate static hosting; its JavaScript and progress data are independent. The folder can be moved into a standalone repository unchanged.

## What is included

- **10 OWASP cases** — one for each 2025 category, with a fictional incident, plain-English analogy, concept explanation, four-stage animated diagram, defensive checklist, detection notes and unsafe-versus-safer code examples.
- **30 questions** — three per case, with explanations and a two-out-of-three passing threshold.
- **33 annotated specimens** — SQL injection, XSS, shell metacharacters, SSTI, access-control tests, CORS and deployment examples, session handling, supply-chain cases, error handling and more. Every specimen is escaped text and never executed.
- **Six TTP investigations** — fictional event records that ask an analyst to select the best defensive next step; includes MITRE technique references.
- **Game progression** — mission clearance, XP, bonus for perfect answers, achievements in the specimen notebook, rank progression, streak counters and a progress meter. Progress is stored in browser `localStorage` (no account or server).
- **Visual design** — responsive dossier UI, animated request flow and topology markers, an interactive four-stage trust-boundary diagram, code comparisons, reduced-motion support and keyboard navigation.

## How to run

Serve this directory with a local HTTP server, or open the published site. ES modules may not work from `file://` in all browsers.

```bash
python -m http.server 8000
# Open http://localhost:8000/casefile-zero/
```

When running the server from this folder itself, open `http://localhost:8000/` instead.

## Tests

Requires Node 22 or later, but the game has **no Node dependencies**.

```bash
node --check app.mjs
node --check engine.mjs
node --check content.mjs
node tests/verify.mjs
```

The test covers category ordering, question counts, specimens, quiz progression, XP calculations, save validation and integrity of the app shell. Manual browser testing is recommended for layout and interaction.

## Important limitations

This is a **safe educational simulator**, not a vulnerable web app or a penetration-testing console. Payload snippets are plain text only: the game does not evaluate scripts, build SQL, run shell commands, fetch URLs from examples, scan hosts, capture credentials or send traffic to any target. Many OWASP categories do not have a meaningful single payload, so those chapters teach configuration, evidence, workflow and trust boundaries instead.

It is not possible to list **all** security payloads: the correct input depends on context, target code, language, parser and authorization. This project instead provides a curated set with mechanism and mitigation notes. Only test systems you own or are explicitly permitted to assess.

The diagrams are conceptual. Example code is simplified pseudocode, not copy-and-paste production security middleware. Version 2025 is used rather than assuming the 2021 OWASP ranking. The MITRE-style investigation storylines are fictional.

**Sources:** [OWASP Top 10:2025](https://top10.owasp.org/2025/), [OWASP WSTG](https://wstg.owasp.org/), [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/), [MITRE ATT&CK FAQ](https://attack.mitre.org/resources/faq/).

An independent learning project, not affiliated with or endorsed by OWASP or MITRE. The source material links above retain their respective owners' licenses; the original game code and scenarios are authored for this project.
