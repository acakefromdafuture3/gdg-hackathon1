import os
import json
import re
import google.generativeai as genai
from typing import List

# -------------------------------
# Gemini Configuration
# -------------------------------
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


# -------------------------------
# 1. Autofill Issue Fields
# -------------------------------
def generate_issue_fields(topic: str) -> dict:
    prompt = f"""
You are an assistant for a college campus issue reporting system.

Analyze the issue title below and return a JSON object with:
- description (2–3 sentences, student-friendly)
- category (one of: Infrastructure, Network, Classroom, Hostel, Other)
- severity (one of: High, Medium, Low)

Rules:
- Return ONLY valid JSON
- Do NOT include explanations
- Do NOT repeat the title in the description

Issue title: {topic}
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        if not text:
            return {
                "description": "AI service is temporarily unavailable. Please fill the details manually.",
                "category": "",
                "severity": "",
            }

        # Remove markdown code fences if present
        text = re.sub(r"```json|```", "", text).strip()

        # Extract JSON safely
        match = re.search(r"\{[\s\S]*\}", text)
        if not match:
            raise ValueError("No JSON object found in AI response")

        data = json.loads(match.group())

        return {
            "description": data.get("description", ""),
            "category": data.get("category", "Other"),
            "severity": data.get("severity", "Medium"),
        }

    except Exception as e:
        print("Gemini error:", e)
        return {
            "description": "The issue has been observed on campus and requires attention.",
            "category": "Other",
            "severity": "Medium",
        }


# -------------------------------
# 2. One-line Issue Summary (Admin)
# -------------------------------
def summarize_issue(description: str) -> str:
    """
    Generates a single-line summary for admin dashboard.
    """

    if not description or not description.strip():
        return ""

    prompt = f"""
You are assisting a college administrator.

Given the issue description below, generate a SINGLE concise sentence
that summarizes the core problem and its impact.

Rules:
- Do NOT repeat sentences from the description
- Do NOT start with "The issue is" or similar filler
- Focus on WHAT is broken and WHY it matters
- Be professional and action-oriented
- Max 20 words

Issue Description:
\"\"\"{description}\"\"\"
"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception:
        return description.split(".")[0].strip() + "."


# -------------------------------
# 3. Duplicate Issue Detection
# -------------------------------
def is_duplicate_issue(new_issue: str, existing_issues: List[str]) -> bool:
    """
    Checks whether a new issue is semantically similar
    to existing unresolved issues.
    """

    if not new_issue or not existing_issues:
        return False

    issues_text = "\n".join(
        f"- {issue}" for issue in existing_issues[:5]
    )

    prompt = f"""
Determine whether the NEW issue below is a duplicate of any
existing issues.

Respond with ONLY "YES" or "NO".

Existing Issues:
{issues_text}

New Issue:
"{new_issue}"
"""

    try:
        response = model.generate_content(prompt)
        answer = response.text.strip().upper()
        return answer == "YES"

    except Exception:
        return False
