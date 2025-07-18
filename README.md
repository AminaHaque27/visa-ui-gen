# 💡 Visa UI Generator – Component Suggestion Tool

## Overview

This web-based tool helps developers quickly turn plain-English UI descriptions (e.g. “responsive login form with remember me”) into:

- Suggested components from the **Visa Product Design System (Nova UI)**
- Auto-generated code snippets styled with Visa's design tokens

The goal is to go from idea to usable code quickly for rapid prototyping and exploration.

---

> **Usage Tip**  
>  On first use, loading may take a few seconds due to backend initialization.
Please press or click Enter only once after entering your input—spamming Enter may cause delays or duplicate results.

---

## ✨ Tech Stack & Design Choices

- **Frontend:** React + Vite with `@visa/nova-react` and `@visa/nova-icons-react`
- **Backend:** FastAPI (hosted on **Render**) providing the `/suggest` AI-powered endpoint
- **Deployment:** Frontend is deployed via **Vercel**
- **Styling:** Dark mode theme using Nova UI tokens + animated gradient background
- **Preview:** `react-live` renders code snippets and components in real-time
- **Persistence:** Query history saved in `localStorage`
- **Accessibility:** Includes keyboard navigation, visible focus states, and WCAG-friendly contrast

---

## 🧠 AI Involvement

The backend uses the **OpenAI API** to interpret prompts and return relevant components with example code.

During development, I also used ChatGPT to:
- Brainstorm how prompts should map to components
- Troubleshoot issues in FastAPI and React
- Improve layout and UX patterns
.

---

## ⚡ Assumptions & Shortcuts

- The suggestion engine is simple and prompt-based—not trained on real-world usage or design data
- No user login or cloud database; just `localStorage` for basic persistence
- Focused purely on the UI generator—no IDE or Figma plugins (yet)

---

## 🚀 If I Had More Time...

- Build a smarter suggestion engine using actual Nova token metadata
- Let users share, favorite, or categorize snippets
- Add a quick-start onboarding or interactive walkthrough
- Create a Figma plugin or VSCode extension
- Implement tests and CI/CD pipelines
- Offer more formatting and layout options

---

## 🔗 Live Demo

👉 [https://visa-ui-gen.vercel.app](https://visa-ui-gen.vercel.app)
