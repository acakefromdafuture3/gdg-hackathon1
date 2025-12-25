# 🏫 Campus Issue Portal

A centralized, AI-assisted web platform that enables students to report campus issues and allows administrators to track, manage, and resolve them efficiently with transparency and accountability.

---

## 🚀 Problem Statement

In many institutions, campus-related issues such as infrastructure faults, hygiene problems, or classroom maintenance are reported informally through word-of-mouth or scattered channels.  
This leads to:
- Delayed resolutions
- Lack of accountability
- No proper tracking or feedback
- Repeated reporting of the same issues

---

## 💡 Our Solution

**Campus Issue Portal** provides a structured digital system where:
- Students can easily report issues
- Administrators can monitor, prioritize, and resolve them
- AI assists in summarization, categorization, and duplicate detection
- Students receive real-time updates and feedback

---

## ⭐ Major USP

**AI-assisted issue reporting and management** — the system intelligently autofills issue details, summarizes reports, and detects duplicates, reducing effort for students and workload for administrators.

---

## ✨ Key Features

### 👩‍🎓 Student Features
- Secure login & registration
- Report issues with title, description, category, severity, and location
- **AI-powered autofill** for description, category, and severity
- Track issue status in real time
- View admin feedback and resolution updates
- Email notification on issue resolution or rejection

### 🧑‍💼 Admin Features
- Centralized admin dashboard
- View and manage all reported issues
- AI-generated issue summaries
- Duplicate issue detection
- Update issue status (Pending / In Progress / Resolved / Rejected)
- Add **internal admin notes** (not visible to students)
- Send **custom messages to students**
- Automated email notifications on final resolution

---

## 🧠 AI Capabilities

- Issue summarization for quick admin review
- Duplicate issue detection to avoid redundant work
- Smart autofill assistance during issue reporting

---

## 🏗️ System Architecture (High Level)

- **Frontend**: React (Student & Admin dashboards)
- **Backend**: Flask REST API
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI Services**: Custom AI endpoints for summarization and duplicate detection
- **Email Service**: Automated email notifications on issue finalization
- **Deployment**:
  - Frontend: Vercel
  - Backend: Render

---
## 💻 Workflow
``` mermaid
flowchart TD
    A[Student Registers / Logs In]
    B[Student Reports Issue]
    C["AI Assists Autofill Description, Category, Severity"]
    D[Issue Stored in Database]
    E[Issue Routed to Admin Dashboard]
    F["AI Analysis Summary & Duplicate Detection"]
    G[Admin Reviews Issue]
    H["Admin Updates Status\nPending / In Progress / Resolved / Rejected"]
    I["Admin Adds Internal Note\nand Student Message"]
    J[Email Notification Sent to Student]
    K["Student Views Updated Status\nand Feedback"]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
```

---

## 🔐 Security & Access Control

- Token-based authentication
- Role-based access (Student / Admin)
- Protected routes and APIs
- Internal admin notes hidden from students

---
## 🎥 Demo

- 🔗 Live App: (https://gdg-hackathon-32wi.vercel.app/) 
- 🔗 Video: (https://drive.google.com/file/d/1qD5SObnhdG7QCoxJ-64Vc4HGDqe2-iTl/view?usp=sharing)

---

## 🌱 Future Enhancements

- Mobile application (Android & iOS)
- Multi-institution support
- Issue assignment to maintenance staff
- SLA tracking and analytics
- Multilingual AI support
- Location-based heatmaps
- WhatsApp/SMS notifications
- OAuth login (Google Sign-In)

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Flask (Python)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI Integration**: Gemini AI API
- **Deployment**: Vercel, Render

---

## 👥 Team

**Parallel Minds**  
A collaborative team focused on building scalable, intelligent, and user-centric solutions.

- **[Ritankar Bose](https://www.linkedin.com/in/ritankar-bose-a30089329/)** — Frontend Development  
  *UI design, React architecture, user experience*

- **[Rani Bhattacharjee](https://www.linkedin.com/in/rani-bhattacharjee-88320b394/)** — Backend Development  
  *Flask APIs, database logic, authentication, AI integration*
---

## 📜 License

This project is developed as a prototype for hackathon and educational purposes.
