from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI
import os
import json

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
    allow_methods=["*"],
    allow_headers=["*"]
)

# JSON file for storing queries
DATA_FILE = "saved_queries.json"

# Load past queries
def load_queries():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            json.dump([], f)
    with open(DATA_FILE, "r") as f:
        return json.load(f)

# Save updated queries
def save_queries(queries):
    with open(DATA_FILE, "w") as f:
        json.dump(queries, f, indent=2)

# AI Endpoint
@app.get("/suggest")
def suggest_components(query: str):
    prompt = f"""
You are a helpful UI assistant trained on the Visa Nova React design system.

You must:
- Only use components from "@visa/nova-react"
- Never invent components (❌ <VisaInputField /> or <NovaForm />)
- Never use plain HTML elements (❌ <input>, <button>, <label>)

✅ Valid Nova components include:
- Input
- Button (can have 'variant' like "primary", "secondary", "outline", "ghost"; and 'size' like "small", "medium", "large")
- Checkbox
- Typography
- InputContainer
- Utility
- Link
- Tabs

✅ Example output:
{{
  "components": ["Button"],
  "code": "<Button title='Submit' variant='primary' buttonSize='large' />"
}}

✅ Example output:
{{
  "components": ["Input", "Input", "Checkbox", "Button"],
  "code": "<form>\\n  <Input placeholder='Email' type='email' />\\n  <Input placeholder='Password' type='password' />\\n  <Checkbox label='Remember me' />\\n  <Button title='Login' variant='primary' buttonSize='medium' />\\n</form>"
}}


Given this user request:
"{query}"

Return ONLY a valid JSON object with:
- "components": list of Nova components
- "code": JSX string using them

All JSX code must be valid and syntactically correct.

⚠️ If returning more than one element, wrap them inside a parent tag:
✅ Valid: <div><Button /><Input /></div>
✅ Valid: <> <Button /> <Input /> </>

❌ Invalid: <Button /> <Input />

Important: Do not explain anything. Do not include markdown or commentary.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4
        )

        result = response.choices[0].message.content.strip()
        print("🔵 RAW RESPONSE:", result)

        parsed = json.loads(result)
        return parsed

    except json.JSONDecodeError as e:
        print("❌ JSON decode error:", e)
        return {
            "components": ["Input", "Input", "Button"],
            "code": "<form><Input placeholder='Username' /><Input placeholder='Password' type='password' /><Button title='Login' /></form>"
        }

    except Exception as e:
        print("❌ General error:", e)
        return {
            "components": ["Input", "Button"],
            "code": "<form><Input placeholder='Something went wrong' /><Button title='Retry' /></form>"
        }

# Save a query result
@app.post("/queries")
async def save_query(request: Request):
    data = await request.json()
    queries = load_queries()
    queries.append(data)
    save_queries(queries)
    return {"shared_id": str(len(queries))}

# Get all saved queries
@app.get("/queries")
def get_queries():
    return load_queries()

@app.delete("/queries")
def delete_queries():
    save_queries([])  # Clear the file
    return {"message": "All queries cleared!"}
