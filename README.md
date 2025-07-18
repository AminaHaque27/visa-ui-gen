# 💡 Visa UI Generator – Component Suggestion Tool

## Overview

This web-based tool helps developers quickly turn plain-English UI descriptions (e.g. “responsive login form with remember me”) into:

- Suggested components from the **Visa Product Design System (Nova UI)**
- Auto-generated code snippets styled with Visa's design tokens

The goal is to go from idea to usable code quickly for rapid prototyping and exploration.

---

> **Usage Tip**  
> On first use, the app may take a few seconds to load due to backend initialization.  
> Please press or click **Enter** only once after submitting your prompt.  
>  
> At times, it may take up to **60 seconds** to load. **Please be patient** as the server warms up.  
> _(A loading indicator will be added in a future update.)_

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

## Local Development & Setup

To run this project locally, ensure you have the following installed:

- Node.js (v18 or higher)  
- Python 3.10 or higher  
- A valid OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/AminaHaque27/visa-ui-gen.git
cd visa-ui-gen
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

The Vite dev server will start at:

```
http://localhost:5173
```

### 3. Backend Setup (FastAPI)

```bash
# Navigate to the backend folder
cd backend

# Create and activate a virtual environment
python -m venv env
source env/bin/activate        # On Windows: env\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app:app --reload
```

The backend will run at:

```
http://localhost:8000
```

### 4. Environment Variables

In the `backend/` folder, create a `.env` file and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### 5. Access the Application

Once both the frontend and backend servers are running, visit:

```
http://localhost:5173
```

You can now enter UI prompts and generate component suggestions and example code.
