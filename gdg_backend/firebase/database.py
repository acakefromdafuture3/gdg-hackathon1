from firebase.init import db
from datetime import datetime
from google.cloud.firestore import Query

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
    issues_ref = (
        db.collection("issues")
        .where("created_by", "==", user_id)
        .order_by("created_at", direction=Query.DESCENDING)
    )

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
        issues.append(data)

    return issues

