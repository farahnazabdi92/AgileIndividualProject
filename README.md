# SkillTrack Learning Portfolio

A four-page interactive web application for **CITS5505** that demonstrates understanding of **HTML, CSS, and JavaScript** through a structured tutorial, dynamic quiz, AI reflection log, and personalised CV page.

## Project Overview

**SkillTrack Learning Portfolio** is designed as a coherent learning product rather than a collection of separate pages. The application teaches core web fundamentals, assesses understanding through a dynamic quiz, documents AI-assisted development decisions, and presents a professional profile of the author.

### Main pages
- **Tutorial** — explains the fundamentals of HTML, CSS, and JavaScript using examples, code snippets, and interactive demonstrations
- **Quiz** — dynamically loads questions from a local data file, validates submission, calculates score/pass-fail, stores attempt history, and fetches reward content on pass
- **AI Reflection** — documents how ChatGPT and Codex were used throughout the project, including planning, implementation, review, and critical evaluation
- **CV** — presents a professional profile, education, experience, volunteer work, and references

## Key Features

### Tutorial page
- Structured learning content for **HTML, CSS, and JavaScript**
- Code examples for each topic
- Interactive demonstrations, including a **live DOM sandbox**
- Best-practice rationale section
- Clear call-to-action leading to the quiz

### Quiz page
- Questions loaded dynamically from a **local JSON data file**
- Questions rendered dynamically in the DOM
- Question order randomized on each load
- Submission validation for unanswered questions
- Score, percentage, and pass/fail result displayed without page reload
- Reward content fetched from a **public API** on pass
- Attempt history stored using **localStorage**
- `beforeunload` warning after the quiz starts and before successful submission
- Smooth scroll to results after submission
- Pass-only celebration effect

### AI Reflection page
- Explains how **ChatGPT** was used for context understanding, requirements clarification, planning, and prompt refinement
- Explains how **Codex** was used for phase-by-phase implementation
- Documents a **12-phase development workflow**
- Includes critical evaluation of AI reliability, risks, and human responsibility
- Includes an expandable example phase prompt

### CV page
- Professional biography summary
- Skills, experience, education, certifications, and languages
- Volunteer and community involvement
- References section acknowledging technical sources and AI assistance

## Technology Stack

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **Bootstrap** (linked locally from `assets/libraries`)
- **Bootstrap JS bundle** for supported interactive components
- **Local JSON data** for quiz questions
- **Public API** for reward content

## Project Structure

```text
AgileIndividualProject/
├── tutorial.html
├── quiz.html
├── ai-reflection.html
├── cv.html
├── README.md
└── assets/
    ├── css/
    │   ├── site.css
    │   ├── tutorial.css
    │   ├── quiz.css
    │   ├── ai-reflection.css
    │   └── cv.css
    ├── js/
    │   ├── site.js
    │   ├── tutorial.js
    │   ├── quiz.js
    │   ├── ai-reflection.js
    │   └── cv.js
    ├── data/
    │   └── quiz-questions.json
    ├── images/
    │   └── ...
    └── libraries/
        └── bootstrap/
            ├── css/
            └── js/