from firebase.init import db
from datetime import datetime

def create_issue(data, user_id):
    issue = {
        "title": data["title"],
        "description": data["description"],
        "category": data["category"],
        "severity": data["severity"],
        "location": data["location"],
        "status": "Pending",
        "created_by": user_id,
        "created_at": datetime.utcnow()
    }
    db.collection("issues").add(issue)

def get_issues_by_user(user_id):
    docs = db.collection("issues").where("created_by", "==", user_id).stream()
    return [doc.to_dict() for doc in docs]

def get_all_issues():
    docs = db.collection("issues").stream()
    return [{**doc.to_dict(), "id": doc.id} for doc in docs]

def update_issue_status(issue_id, status):
    db.collection("issues").document(issue_id).update({
        "status": status
    })
