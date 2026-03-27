import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")


def analyze_document_text(text: str) -> dict:
    if not OPENROUTER_API_KEY:
        raise ValueError("Missing OPENROUTER_API_KEY in environment variables")

    trimmed_text = text[:12000]

    prompt = f"""
You are a document analysis assistant.

Analyze the following document text and return valid JSON only.

Required JSON format:
{{
  "title": "string or null",
  "author": "string or null",
  "summary": "short summary",
  "main_sections": [
    {{
      "heading": "section heading",
      "content": "brief explanation"
    }}
  ]
}}

Rules:
- If title is unclear, return null
- If author is unclear, return null
- Keep summary concise
- Extract the most important sections only
- Return valid JSON only, with no markdown fences

Document text:
\"\"\"
{trimmed_text}
\"\"\"
""".strip()

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": OPENROUTER_MODEL,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
        },
        timeout=60,
    )

    response.raise_for_status()
    data = response.json()

    content = data["choices"][0]["message"]["content"]

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "title": None,
            "author": None,
            "summary": content,
            "main_sections": []
        }