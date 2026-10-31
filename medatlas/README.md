# MedAtlas — interactive medical knowledge website

A complete, responsive **static website** with a learning dashboard, 3D anatomy viewer, clinical knowledge library, medicine reference, medical dictionary, flashcard-style quiz, saved items, and original-source links. All code runs in the browser and does not require npm, a build process, or a backend.

## Contents

- **Overview:** specialty categories, stats, featured knowledge and shortcuts.
- **3D Anatomy Lab:** procedural WebGL anatomy illustration, mouse/touch rotation, zoom, animated breathing/heart, systems toggle, labels and organ explanations. It uses a *simplified illustration*, not a medical-grade anatomical model. Includes 2D fallback when WebGL is not supported.
- **Guidelines & Policies:** searchable educational summaries of common infection prevention, safety, communication, consent, medication and emergency concepts. These do not constitute a facility's legal or clinical policies.
- **Conditions & Care:** selected common conditions and signs that require assessment.
- **Medicine Index:** 60 medicine introductions, drug classes, uses, cautions and links to current official drug references. No individual doses or prescriptions.
- **Clinical Techniques:** high-level assessment and clinical workflow information, not hands-on training for invasive procedures.
- **Medical Dictionary:** 140+ definitions and abbreviations, browse by letter.
- **Learning Studio:** 18 quiz questions, feedback and score.
- **Saved Library:** bookmarks and read status stored in this browser only.
- **Sources & About:** WHO, CDC, AHA, AHRQ, MedlinePlus, FDA, OpenStax and Merck references.

## Run locally

**Quick:** open `index.html` in a modern browser.

**Recommended (Windows):** double-click `run-local.bat`. Alternatively in PowerShell:

```powershell
cd path\to\medatlas-site
py -m http.server 8000
```

Then open http://localhost:8000.

**macOS/Linux:**

```bash
cd medatlas-site
python3 -m http.server 8000
```

## Deployment

MedAtlas is published as a separate `medatlas/` directory within the existing portfolio Pages repository. Its public address is https://aounali720.github.io/Pain.github.io/medatlas/ if GitHub Pages is enabled for the `main` branch. It uses relative asset paths and can be moved to a separate repository later.

## File structure

```
medatlas-site/
  index.html         site entry
  styles.css         responsive visual design
  app.js             application UI, search, bookmarks, quizzes
  data.js            article, medicine, dictionary, quiz, reference data
  anatomy.js         native WebGL 3D scene with 2D fallback
  assets/favicon.svg favicon
  run-local.bat       Windows local server
  run-local.sh        macOS/Linux local server
```

## Editorial and safety notes

- **Educational demonstration only.** Not a clinical decision-support system, medical device, personal treatment plan, formulary, hospital policy, certification course or substitute for a licensed health professional.
- Contents are *curated examples*, not a complete inventory of every medical practice, policy, term, technique or medicine.
- Check current local laws, clinical guidelines, local formularies, product-specific instructions, contraindications, interactions, age restrictions, and actual patient circumstances before any use in clinical care.
- No medication dosing or step-by-step invasive procedure instructions are presented. To learn procedures safely, use accredited supervised clinical training.
- The diagram is not anatomically exact or useful for diagnostics.
- For medical emergencies, call local emergency services immediately, not this website.
- The site operates offline except external reference links, which require internet access. It has no trackers or external dependencies.
- Bookmarks and read status use `localStorage` on the current browser; no personal health or patient data should be entered.
- Data was drafted October 2026. Sources may update and this website does not check them in real time.

## Extending the content

The `window.MED_DATA` object in `data.js` contains `articles`, `medicines`, `glossary`, `anatomy`, `quiz`, `categories`, `sources`. Add new entries using the existing object format and link material to relevant reputable references. Review content with domain-qualified professionals before any public-facing clinical deployment.