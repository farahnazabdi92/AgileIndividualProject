# SkillTrack Learning Portfolio

SkillTrack Learning Portfolio is a four-page interactive web application for CITS5505.  
It demonstrates HTML, CSS, and JavaScript fundamentals through a tutorial, a dynamic quiz, an AI reflection log, and a professional CV page.

## Project Summary

This project is designed as one coherent product, not four separate pages.

Pages:
- `tutorial.html`: learning content for HTML, CSS, JavaScript with interactive demos (including a live DOM sandbox).
- `quiz.html`: dynamic quiz loaded from local JSON with validation, scoring, pass/fail, reward API call, attempt history, and beforeunload protection.
- `ai-reflection.html`: critical reflection of ChatGPT + Codex workflow using a phase-based development model.
- `cv.html`: professional profile with education, experience, volunteer gallery, and references.

## Implemented Features

### Tutorial
- Structured sections for HTML, CSS, and JavaScript fundamentals.
- Code examples and best-practice rationale.
- Interactive style-toggle demo.
- Live DOM sandbox for semantic structure, class-based styling, and event-driven DOM updates.
- Clear CTA to the quiz.

### Quiz
- Loads question data from `assets/data/quiz-questions.json` at runtime.
- Renders questions dynamically (not hardcoded in HTML).
- Randomizes question order on each load.
- Validates unanswered questions and highlights missing items.
- Calculates score, percentage, and pass/fail (threshold from quiz data, currently 70%).
- Fetches reward content from public APIs on pass:
  - `https://api.quotable.io/random?tags=technology`
  - `https://type.fit/api/quotes` (fallback)
- Saves attempt history in `localStorage` with defensive parsing and graceful fallback.
- Shows browser `beforeunload` warning only after quiz start and before successful submission.
- Smooth-scrolls to results after valid submission.
- Shows pass-only celebration effect.

### AI Reflection
- Documents separate roles of ChatGPT (planning/prompting) and Codex (implementation).
- Includes a 12-phase workflow section.
- Includes accordion panels with phase prompt examples.
- Includes limitation/risk discussion and critical evaluation.

### CV
- Real profile content, contact details, and profile image.
- Skills, experience, education, certifications, languages.
- Volunteer and community involvement with responsive thumbnail galleries and modal preview.
- References section with real source links and AI assistance acknowledgement.

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Bootstrap 5.3.8 (local files, no CDN dependency)

## Project Structure

```text
AgileIndividualProject/
|-- tutorial.html
|-- quiz.html
|-- ai-reflection.html
|-- cv.html
|-- README.md
`-- assets/
    |-- css/
    |   |-- site.css
    |   |-- tutorial.css
    |   |-- quiz.css
    |   |-- ai-reflection.css
    |   `-- cv.css
    |-- js/
    |   |-- site.js
    |   |-- tutorial.js
    |   |-- quiz.js
    |   `-- volunteer-gallery.js
    |-- data/
    |   `-- quiz-questions.json
    |-- images/
    |   `-- (profile, logos, volunteer photos, UWA logo)
    `-- libraries/
        `-- bootstrap-5.3.8-dist/
            |-- css/bootstrap.min.css
            `-- js/bootstrap.bundle.min.js
```

## How to Run

1. Open the project folder.
2. Start from `tutorial.html` in a browser.
3. Navigate using the top menu (`Tutorial -> Quiz -> AI Reflection -> CV`).

Note:
- If a browser blocks local `fetch` for JSON on `file://`, run from a local web server.

## Accuracy Notes

- README content has been aligned with the current implementation and file structure.
- Removed references to non-existent files (`ai-reflection.js`, `cv.js`) that were previously listed.
- Updated Bootstrap path description to match the actual local library directory.
