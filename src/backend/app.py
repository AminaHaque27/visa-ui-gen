from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI
import os
import json
import re
import traceback

# Load environment variables from .env
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
print("Loaded API key:", api_key[:10] + "..." if api_key else "None found")

client = OpenAI(api_key=api_key)

app = FastAPI()

# CORS settings (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# JSON file for storing queries
DATA_FILE = "saved_queries.json"

def load_queries():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            json.dump([], f)
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_queries(queries):
    with open(DATA_FILE, "w") as f:
        json.dump(queries, f, indent=2)

def clean_json_response(raw: str):
    # Strip triple backticks and markdown formatting
    cleaned = re.sub(r"```(?:json|jsx)?\s*([\s\S]*?)\s*```", r"\1", raw.strip())
    
    # Remove any leading text before the JSON object starts
    cleaned = re.sub(r"^[^{]*({)", r"\1", cleaned)  # remove junk before {
    
    # Remove any trailing junk after the last closing brace
    cleaned = re.sub(r"(})[^}]*$", r"\1", cleaned)
    
    return cleaned


# 💡 Elevated prompt with component reasoning
def build_prompt(query: str) -> str:
    return f"""
You are a senior UI engineer helping developers build UIs using only "@visa/nova-react" components.

Given the user's request:
"{query}"

Think carefully through which components are appropriate and why.

You may only choose from: Input, Button, Checkbox, Typography, InputContainer, Utility, Link, Tabs.

Return a valid JSON object with this structure:

{{
  "components": ["Component1", "Component2", ...],
  "reasoning": "Why each component is used",
  "code": "<JSX code using those components>"
}}

⚠️ DO NOT:
- Explain anything outside the JSON
- Use markdown or code fences
- Include comments inside JSX
- Use HTML like <input> or <button>

❗ Typography Guidelines:
- Use `headline-3`, `headline-2`, or `subtitle-1` for section headings
- Avoid `h1` or `display-1` unless the user explicitly asks

Wrap each input field in its own <InputContainer label="...">.  
Use correct types like `type="date"` for dates and `type="number"` for age.  
Use `placeholder` text to guide the user.
Use vertical layout with gap or spacing between fields.


✅ DO:
- Use InputContainer to group fields
- Add Typography for headings or helper text
- Use only the allowed components
- Wrap layout in <div> or <> ... </>
"""



# 🚀 AI endpoint
@app.get("/suggest")
def suggest_components(query: str):
    prompt = build_prompt(query)

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4
        )

        raw_result = response.choices[0].message.content.strip()
        print("🔵 RAW RESPONSE:", raw_result)

        cleaned_result = clean_json_response(raw_result)
        try:
            parsed = json.loads(cleaned_result)
        except json.JSONDecodeError as e:
            print("❌ Cleaned JSON still failed to parse:")
            print("🧼 Cleaned Output:", cleaned_result)
            raise e  # trigger fallback

        print("🟢 PARSED JSON:", parsed)
        return parsed

    except json.JSONDecodeError as e:
        print("❌ JSON decode error:", e)
        return {
            "components": ["Input", "Input", "Button"],
            "reasoning": "Fallback due to formatting issue. Using common login form fields.",
            "code": "<form><Input placeholder='Username' /><Input placeholder='Password' type='password' /><Button title='Login' /></form>"
        }

    except Exception as e:
        print("❌ General error:", traceback.format_exc())
        return {
            "components": ["Input", "Button"],
            "reasoning": "Fallback due to an unknown error.",
            "code": "<form><Input placeholder='Something went wrong' /><Button title='Retry' /></form>"
        }


# 📝 Save a query result
@app.post("/queries")
async def save_query(request: Request):
    data = await request.json()
    queries = load_queries()
    queries.append(data)
    save_queries(queries)
    return {"shared_id": str(len(queries))}

# 📂 Get all saved queries
@app.get("/queries")
def get_queries():
    return load_queries()

# ❌ Clear all queries
@app.delete("/queries")
def delete_queries():
    save_queries([])  # Clear the file
    return {"message": "All queries cleared!"}
