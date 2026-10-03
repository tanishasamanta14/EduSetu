# EduSetu — AI-Powered Learning Companion

## 1. Problem Statement

In rural and semi-urban regions of India, students face significant barriers to quality education: a shortage of trained teachers, lack of personalized attention due to large class sizes, language barriers in understanding complex concepts, and absence of doubt-resolution support outside classroom hours. Dropout rates increase sharply after Class 8 due to disengagement, repeated academic failure, and lack of timely intervention.

Existing ed-tech solutions (Byju's, Khan Academy, Vedantu, etc.) are mostly **English-first, subscription-based, one-directional content libraries**. They push video lessons at students but rarely:
- Diagnose **why** a student is stuck on a specific concept
- Explain in the student's **own regional language** with grade-appropriate depth
- Give **teachers/parents early warning** before a student disengages completely
- Work meaningfully on **low-end devices / patchy internet**

There is a need for an affordable, multilingual, **diagnostic-first** AI learning platform that doesn't just answer questions, but identifies *which specific misconception* is causing a student to struggle, explains it adaptively, and surfaces that insight to the people who can intervene — bridging the gap toward SDG 4 and SDG 10.

---

## 2. Our Solution — What Makes EduSetu Different 

EduSetu is an AI learning companion built around one core idea: **"Don't just answer the question — find the gap."**

### Uniqueness vs existing apps (Byju's, Khan Academy, Vedantu, Doubtnut, etc.)

| Feature | Typical ed-tech apps | EduSetu |
|---|---|---|
| Content model | Pre-recorded video libraries | Live AI conversation, adaptive per student |
| Doubt solving | Search/forward to a human tutor (slow, costly) | Instant AI chatbot, step-by-step, in Hindi/English |
| Diagnosis | None — students pick their own topics | **Misconception Tagging Engine**: every wrong quiz answer is tagged with *why* it's wrong (e.g. "sign error," "confused numerator/denominator"), not just "incorrect" |
| Analytics | Generic score reports | **Concept Mastery Map** — visual graph of which concepts are solid, shaky, or unlearned, updated live |
| Teacher/parent role | Mostly absent or paid add-on | Built-in **Mentor View** — auto-generated weekly "what to revise with this student" notes |
| Accessibility | Needs steady internet & modern phone | Offline-first lesson caching + low-bandwidth chat mode |
| Engagement model | Streaks/gamification for retention | **"Confidence Score"** — a self-reported + quiz-derived measure that helps students see real growth, reducing anxiety-driven dropout |

### The Signature Feature: Concept Mastery Map
Instead of a generic dashboard, EduSetu visualizes each subject as a **network of interconnected concepts** (like a mind-map/skill-tree). Each node is color-coded:
- Green — Mastered
- Amber — Shaky (needs review)
- Gray — Not yet attempted
- Blue — Currently recommended

This gives students, teachers, and parents an honest, at-a-glance picture of *real* understanding — not just test scores — and is the analytics centerpiece that helps users "clarify concepts."

---

## 3. App Architecture

### 3.1 High-Level System Architecture

```
+-------------------------------------------------------------------+
|                       CLIENT (Browser / PWA)                       |
|  +----------+  +----------+  +-----------+  +-------------------+ |
|  | Landing  |  | AI Tutor |  | Mastery   |  | Mentor View        | |
|  | Page     |  | Chat UI  |  | Map       |  | (Teacher/Parent)   | |
|  +----------+  +----------+  +-----------+  +-------------------+ |
|       Shared: Auth, Theme, Language Toggle, Offline Cache          |
+----------------------------+----------------------------------------+
                               | REST / WebSocket
+------------------------------v--------------------------------------+
|                     BACKEND (Node.js / Express)                      |
|  +-----------+  +--------------+  +----------------+  +-----------+ |
|  | Auth & User|  | AI Tutor     |  | Misconception  |  | Analytics | |
|  | Service    |  | Service      |  | Tagging Engine |  | Engine    | |
|  |            |  | (Claude API) |  |                |  |           | |
|  +-----------+  +--------------+  +----------------+  +-----------+ |
+----------------------------+----------------------------------------+
                               |
+------------------------------v--------------------------------------+
|                     DATABASE (MongoDB / Firebase)                    |
|   Users | Concepts Graph | Quiz Attempts | Chat History | Mastery    |
+-----------------------------------------------------------------------+
```

### 3.2 Pages / Modules

1. **Landing Page** (`index.html`)
   - Hero, problem stats, features, SDG mapping, how-it-works
   - (Already built — reuse existing design system)

2. **AI Tutor / Chatbot** (`chatbot.html`)
   - Conversational doubt-solving (EN/HI), grade-adaptive
   - **NEW:** After each AI response, student self-rates "Did this make sense?" (Got it / Kind of / Still confused) -> feeds Confidence Score

3. **Concept Mastery Map** (`mastery-map.html`) — **NEW PAGE**
   - Interactive skill-tree/graph per subject (Math, Science, English, etc.)
   - Nodes color-coded by mastery level (mastered/shaky/unattempted/recommended)
   - Clicking a node opens a side panel: mini-quiz, AI explanation shortcut, related concepts

4. **Adaptive Quiz** (`quiz.html`) — **NEW PAGE**
   - Short diagnostic quizzes per concept
   - Each wrong answer triggers the **Misconception Tagging Engine** — classifies *why* it's wrong from a predefined rubric per question
   - Results feed directly into the Mastery Map

5. **Student Dashboard** (`dashboard.html`)
   - Existing chart-based view (subject scores, recommended topics, dropout risk)
   - Add: Confidence Score trend line, link to Mastery Map

6. **Mentor View** (`mentor.html`) — **NEW PAGE**
   - For teachers/parents — login as "Mentor," see linked students
   - Weekly auto-generated summary: "Riya is shaky on Algebraic Expressions (sign errors) and Light - Refraction. Suggested: 10-min revision on sign rules."
   - Dropout risk indicators across a class/group of students

7. **Settings / Profile** (`profile.html`) — **NEW PAGE**
   - Language preference (EN/HI, expandable)
   - Grade level, subjects enrolled
   - Offline content download manager

### 3.3 Project Structure

```
EduSetu/
│
├── frontend/
│   ├── pages/
│   │   ├── index.html
│   │   ├── explore.html
│   │   ├── chatbot.html
│   │   ├── dashboard.html
│   │   ├── quiz.html
│   │   ├── mastery-map.html
│   │   ├── mentor.html
│   │   └── profile.html
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── locales/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   └── ai/
│
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

### 3.4 Data Model (simplified)

```
User {
  id, name, role: "student" | "mentor",
  grade, language, linkedMentors[] / linkedStudents[]
}

Concept {
  id, subject, name, prerequisites[], gradeLevel
}

MasteryRecord {
  userId, conceptId, status: "mastered" | "shaky" | "unattempted" | "recommended",
  lastUpdated, confidenceScore
}

QuizAttempt {
  userId, conceptId, questionId, isCorrect,
  misconceptionTag (e.g. "sign-error", "numerator-denominator-confusion"),
  timestamp
}

ChatMessage {
  userId, sessionId, sender: "user" | "ai", text, language, gradeLevel,
  selfRating: "yes" | "kindof" | "no" | null, timestamp
}
```

### 3.5 Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | HTML/CSS/JS (current) -> optionally migrate to React for state-heavy pages (Mastery Map, Mentor View) | Keep existing design system (`css/style.css`) as base |
| Styling | Existing tokens: Indigo `#1E3A5F`, Marigold `#F4A300`, Cream `#FAF7F2` | Extend with status colors: green (mastered), amber (shaky), gray (unattempted), blue (recommended) |
| Visualization | D3.js or vis-network for Concept Mastery Map graph; Chart.js for dashboard charts (already used) | |
| AI Engine | Claude API (`/v1/messages`) for chatbot; mock responses as fallback (already implemented) | Extend system prompt to also return a structured "misconception tag" when grading quiz answers |
| Backend | Node.js + Express (or serverless functions on Vercel) | |
| Database | Firebase Firestore (fastest for student project) or MongoDB | |
| Hosting | Vercel/Netlify (static + serverless functions) | |
| Auth | Simple email/PIN login or Firebase Auth (mentor-student linking via invite code) | |

---

## 4. Step-by-Step Implementation Plan for Antigravity Agent

Feed this section directly to your Antigravity agent. Existing files (`index.html`, `chatbot.html`, `dashboard.html`, `css/style.css`, `css/chatbot.css`, `css/dashboard.css`, `js/main.js`, `js/chatbot.js`, `js/dashboard.js`) already exist — **extend, don't replace**, unless a step says otherwise.

```
STEP 0: Review existing codebase
- Read index.html, chatbot.html, dashboard.html and all css/js files
- Note existing design tokens in css/style.css (colors, fonts, spacing, components)
- All new pages must reuse the same navbar, footer, and design tokens for consistency

STEP 1: Extend design tokens (css/style.css)
- Add mastery status colors as CSS variables:
  --status-mastered: #3DA35D (green)
  --status-shaky: #E0A526 (amber)
  --status-unattempted: #B4B2A9 (gray)
  --status-recommended: #378ADD (blue)
- Add a "Mastery Map" and "Mentor View" link to the shared navbar across ALL pages
  (index.html, chatbot.html, dashboard.html, and new pages)

STEP 2: Build Concept Mastery Map page (mastery-map.html + css/mastery-map.css + js/mastery-map.js)
- Subject selector tabs at top (Math, Science, English, Social Science, Hindi)
- Render an interactive node graph using vis-network (CDN) or D3.js:
  - Nodes = concepts (e.g. "Fractions", "Algebraic Expressions", "Photosynthesis")
  - Edges = prerequisite relationships (e.g. "Fractions" -> "Algebraic Expressions")
  - Node color = mastery status (use new CSS variables)
- Use a mock dataset (js/mastery-data.js) with ~10-15 concepts per subject and realistic
  prerequisite chains
- Clicking a node opens a side panel (slide-in or modal) showing:
  - Concept name, current status, last quiz score
  - "Ask AI to explain this" button -> links to chatbot.html with concept pre-filled
  - "Take a quick quiz" button -> links to quiz.html with concept ID
- Add a legend explaining the 4 color states
- Must be responsive: graph should resize/scroll on mobile, side panel becomes
  a bottom sheet on small screens

STEP 3: Build Adaptive Quiz page (quiz.html + css/quiz.css + js/quiz.js)
- Accepts a concept ID via URL param (?concept=fractions)
- Shows 5 multiple-choice questions for that concept (mock data in js/quiz-data.js)
- Each wrong answer option has a pre-tagged "misconceptionTag" and a short
  explanation of that specific error (e.g. "You added the denominators too —
  remember the denominator stays the same when adding like fractions")
- On quiz completion:
  - Show score, list of misconception tags triggered
  - Update mock MasteryRecord (store in localStorage for demo) -> status becomes
    "mastered" (80%+), "shaky" (40-79%), or stays "unattempted"-derived if <40%
  - Button: "View updated Mastery Map" -> mastery-map.html
- Visual style: one question at a time, progress bar at top, immediate feedback
  per question (correct/incorrect + misconception explanation) before moving on

STEP 4: Extend AI Tutor chatbot (chatbot.html, js/chatbot.js)
- After each AI response bubble, add 3 small buttons: "Got it" / "Kind of" / "Still confused"
- Store these ratings (localStorage for demo) — used to compute Confidence Score
- If concept ID is passed via URL (?concept=algebraic-expressions from Mastery Map),
  pre-fill the chat input with a relevant starter question and auto-send it
- Add a "Confidence Score" mini-widget in the chat header showing a rolling
  percentage of "Got it" responses

STEP 5: Build Mentor View page (mentor.html + css/mentor.css + js/mentor.js)
- Mock login toggle: "I am a Mentor" (simple role switch, no real auth needed for demo)
- List of linked students (mock data: 3-4 students with names, grades, avatars)
- For each student, show:
  - Mini Mastery Map summary (count of mastered/shaky/unattempted concepts)
  - Auto-generated weekly note (template-based text generation using mock data,
    e.g. "{name} is shaky on {concept} ({misconceptionTag}). Suggested: {action}.")
  - Dropout risk badge (reuse existing risk-badge styles from dashboard.css)
- Add a simple "class overview" chart (Chart.js) showing average mastery % across
  the linked students per subject

STEP 6: Build Profile/Settings page (profile.html + css/profile.css)
- Language preference toggle (EN/HI) — store in localStorage, apply across chatbot
- Grade level selector
- "Offline content" section: list of subjects with a mock "Download for offline" button
  (toggle state only, no real file download needed for demo)
- Role switch (Student / Mentor) for demo purposes — links to mentor.html if Mentor selected

STEP 7: Update Student Dashboard (dashboard.html, js/dashboard.js)
- Add a "Confidence Score" line chart (Chart.js) showing trend over last 4 weeks
  (mock data)
- Add a "View full Concept Mastery Map" CTA card linking to mastery-map.html
- Ensure dropout risk badge logic is consistent with Mentor View

STEP 8: Cross-page consistency pass
- Ensure navbar on ALL pages includes: Home, AI Tutor, Mastery Map, Dashboard,
  Mentor View, Profile (icon)
- Ensure all new pages use existing fonts (Sora/Inter), color tokens, button styles,
  card styles from css/style.css
- Test color contrast for all 4 mastery status colors against both light backgrounds

STEP 9: Responsiveness & accessibility pass
- Test all new pages at 375px, 768px, 1280px widths
- Mastery Map graph: ensure touch/tap works on mobile (not just hover)
- All interactive elements have visible focus states and aria-labels
- Add a favicon if not already present

STEP 10: Final polish & deployment prep
- Update README.md "Pages" section with new pages
- Add inline code comments explaining mock data structure (so it's easy to swap
  for a real backend later)
- Verify all internal links work across the full site
- Prepare for Vercel/Netlify deployment (static site, no config needed)
```

---

## 5. Mock Data Structure Reference (for Antigravity)

```js
// js/mastery-data.js (example structure)
const CONCEPTS = {
  math: [
    { id: "fractions", name: "Fractions", grade: 6, prerequisites: [], status: "mastered" },
    { id: "algebraic-expressions", name: "Algebraic Expressions", grade: 8, prerequisites: ["fractions"], status: "shaky" },
    { id: "linear-equations", name: "Linear Equations", grade: 8, prerequisites: ["algebraic-expressions"], status: "unattempted" },
    // ... 10-15 total per subject
  ],
  science: [ /* similar structure */ ]
};

// js/quiz-data.js (example structure)
const QUIZZES = {
  "algebraic-expressions": [
    {
      question: "Simplify: 3x + 5x - 2",
      options: [
        { text: "8x - 2", correct: true },
        { text: "8x + 2", correct: false, misconceptionTag: "sign-error", explanation: "Check the sign of the constant term — it stays -2, it doesn't flip." },
        { text: "8x^2", correct: false, misconceptionTag: "term-combination-error", explanation: "You can only combine like terms — '2' is a constant, not an x term." },
        { text: "16x", correct: false, misconceptionTag: "ignored-constant", explanation: "Don't forget the constant term -2 in your final answer." }
      ]
    }
    // ... 5 questions per concept
  ]
};
```

---

## 6. Real-Life Impact Summary

- **For students:** A judgment-free space to ask "dumb questions" repeatedly, in their own language, with visual proof of progress (Mastery Map) that builds confidence instead of anxiety.
- **For teachers:** Auto-generated, concept-level insight into *why* a student is struggling — replacing guesswork with targeted intervention, even across large classes.
- **For parents:** A simple weekly note in plain language, without needing to understand the curriculum themselves.
- **For the SDG goals:** Directly targets learning quality (SDG 4) and the urban-rural/income-based learning gap (SDG 10) through language accessibility, offline support, and free/low-cost diagnostic tutoring.

---

## 7. Current Build Status

| Page | Status |
|---|---|
| `index.html` | Built |
| `chatbot.html` | Built (base) — needs Step 4 extensions |
| `dashboard.html` | Built (base) — needs Step 7 extensions |
| `mastery-map.html` | To build (Step 2) |
| `quiz.html` | To build (Step 3) |
| `mentor.html` | To build (Step 5) |
| `profile.html` | To build (Step 6) |
