import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    service_account = os.environ.get("FIREBASE_SERVICE_ACCOUNT")

    if not service_account:
        raise ValueError("FIREBASE_SERVICE_ACCOUNT not set")

    cred = credentials.Certificate(json.loads(service_account))
    firebase_admin.initialize_app(cred)

db = firestore.client()
