import os
import google.generativeai as genai

# -------------------------------
# Gemini Configuration
# -------------------------------
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


# -------------------------------
# 1. Autofill Issue Description
# -------------------------------
def analyze_issue(topic):
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
            raise ValueError("Empty AI response")

        return text

    except Exception as e:
        print("Gemini error:", e)
        return {
            "description": f"The issue related to {topic} has been observed on campus and requires attention.",
            "category": "Other",
            "severity": "Medium"
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
    Summarize the following issue description into ONE clear sentence.
    The sentence should help an admin quickly understand the issue.

    Description:
    "{description}"
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception:
        return description.split(".")[0] + "."


# -------------------------------
# 3. Duplicate Issue Detection
# -------------------------------
def is_duplicate_issue(new_issue: str, existing_issues: list[str]) -> bool:
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
