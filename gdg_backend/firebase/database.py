from firebase.init import db
from datetime import datetime,timedelta


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
def get_recent_issues(days=7, limit=10):
    cutoff_date = datetime.utcnow() - timedelta(days=days)

    issues_ref = (
        db.collection("issues")
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
def update_issue_status(issue_id, new_status):
    issue_ref = db.collection("issues").document(issue_id)
    issue_ref.update({
        "status": new_status
    })
