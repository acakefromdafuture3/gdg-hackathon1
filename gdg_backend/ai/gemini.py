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
def generate_issue_description(title: str) -> str:
    """
    Generates a formal campus issue description from a short title.
    Falls back gracefully if AI fails.
    """

    if not title or not title.strip():
        return ""

    prompt = f"""
    You are assisting a college issue reporting system.

    Write a clear, formal, and concise description (3–4 sentences)
    based on the issue title below.

    Rules:
    - Do NOT invent technical causes
    - Keep language neutral and professional
    - Focus on what is observed, not assumptions
    - Maximum 80 words

    Issue Title: "{title}"
    """

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        # Safety fallback
        if not text:
            raise ValueError("Empty AI response")

        return text

    except Exception:
        # Graceful fallback (never block the user)
        return (
            f"The issue reported is regarding '{title}'. "
            "The problem has been observed on campus and requires attention "
            "from the concerned authorities."
        )


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
