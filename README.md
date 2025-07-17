# Visa UI Generator – Component Suggestion Tool

## Overview

This is a web-based tool that helps developers describe a UI in plain English (e.g., “responsive login form with remember me”) and receive:

- Suggested components from the **Visa Product Design System (Nova UI)**
- Auto-generated code snippets that use those components together

This tool helps developers go from idea to implementation by translating natural language into styled, accessible components using Visa’s design tokens.

---
⚠️ Display Notice
For the best experience, please ensure your browser zoom is set to 100%. If elements appear too large or misaligned, try zooming out slightly.

## ✨ Approach & Technical Choices

- **Frontend**: React + Vite with `@visa/nova-react` and `@visa/nova-icons-react`
- **Backend**: FastAPI for `/suggest` API that handles AI-powered suggestions
- **Styling**: Nova theming with customized dark mode aesthetic (gradient background)
- **Preview**: `react-live` shows real-time preview of generated code
- **Persistence**: Recent queries stored in localStorage
- **Accessibility**: Keyboard navigation, visible focus states, and WCAG-conscious design

---

## 🧠 AI Usage

- Used **OpenAI API** on the backend to translate natural language input into component suggestions and code.
- Leveraged **ChatGPT** during development to:
  - Brainstorm mappings between prompts and components
  - Get unstuck on React, FastAPI, and deployment bugs
  - Refactor and improve UX patterns

AI was used to augment—not replace—my own coding, design, and architectural decisions.

---

## ⚡ Assumptions & Shortcuts

- AI suggestion logic is simple and prompt-driven, not trained on a full dataset of component metadata
- No database or user auth; localStorage is used for saving query history
- Focused on the web app UI; did not implement an IDE extension due to time constraints

---

## 🚀 If I Had More Time

- Build a more intelligent suggestion engine using actual design token metadata
- Let users share, favorite, or organize generated snippets
- Add onboarding experience or tooltips
- Extend with a Figma plugin or VSCode agent demo
- Add test coverage and CI integration
- Add more formatting and styling

---

## 🔗 Live Demo

👉 [https://visa-ui-gen.vercel.app](https://visa-ui-gen.vercel.app)
