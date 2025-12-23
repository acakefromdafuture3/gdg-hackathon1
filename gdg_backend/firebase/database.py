from firebase.init import db
from datetime import datetime,timedelta
# =========================
# Issue lifecycle constants
# =========================
VALID_STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"]
TERMINAL_STATUSES = ["Resolved", "Rejected"]


def create_user_profile(uid, data):
    user = {
        "name": data["name"],
        "dept": data["dept"],
        "year": data.get("year"),
        "email": data["email"],
        "role": "student",  # MODEL 1
        "created_at": datetime.utcnow()
    }
    db.collection("users").document(uid).set(user)


def get_user_role(uid):
    doc = db.collection("users").document(uid).get()
    if doc.exists:
        return doc.to_dict().get("role")
    return None

def create_issue(data, user_id):
    issue = {
        "title": data.get("title"),
        "description": data.get("description"),
        "category": data.get("category"),
        "severity": data.get("severity"),
        "location": data.get("location"),
        "status": "Pending",
        "created_by": user_id,
        "created_at": datetime.utcnow()
    }

    _, doc_ref = db.collection("issues").add(issue)
    return doc_ref.id
def get_issues_by_user(user_id):
    issues_ref = db.collection("issues").where("created_by", "==", user_id)
    docs = issues_ref.stream()

    issues = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        issues.append(data)

    return issues


def get_all_issues():
    docs = db.collection("issues").stream()
    issues = []

    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id

        user_id = data.get("created_by")
        reporter = None

        if user_id:
            user_doc = db.collection("users").document(user_id).get()
            if user_doc.exists:
                user = user_doc.to_dict()
                reporter = {
                    "name": user.get("name"),
                    "dept": user.get("dept"),
                    "year": user.get("year"),
                    "email": user.get("email"),
                }

        data["reporter"] = reporter
        issues.append(data)

    return issues
def get_recent_issues(user_id, days=7, limit=10):
    cutoff_date = datetime.utcnow() - timedelta(days=days)

    issues_ref = (
        db.collection("issues")
        .where("created_by", "==", user_id)
        .where("created_at", ">=", cutoff_date)
        .order_by("created_at", direction="DESCENDING")
        .limit(limit)
    )

    docs = issues_ref.stream()
    issues = []

    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        issues.append(data)

    return issues
def get_issue_stats_by_user(user_id):
    docs = db.collection("issues").where("created_by", "==", user_id).stream()

    total = 0
    pending = 0
    resolved = 0

    for doc in docs:
        total += 1
        status = doc.to_dict().get("status")

        if status == "Pending":
            pending += 1
        elif status == "Resolved":
            resolved += 1

    return {
        "total": total,
        "pending": pending,
        "resolved": resolved
    }

def update_issue_status(issue_id, new_status):
    if new_status not in VALID_STATUSES:
        raise ValueError("Invalid status")

    issue_ref = db.collection("issues").document(issue_id)
    issue_doc = issue_ref.get()

    if not issue_doc.exists:
        raise ValueError("Issue not found")

    issue_data = issue_doc.to_dict()
    current_status = issue_data.get("status")

    # 🔒 Block terminal states
    if current_status in TERMINAL_STATUSES:
        raise PermissionError("Issue is already closed")

    update_data = {
        "status": new_status
    }

    # 🕒 Add terminal timestamps
    if new_status == "Resolved":
        update_data["resolved_at"] = datetime.utcnow()

    elif new_status == "Rejected":
        update_data["rejected_at"] = datetime.utcnow()

    issue_ref.update(update_data)

