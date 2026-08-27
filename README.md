# 🎓 Exam Hub — Frontend

**Exam Hub** is a modern and intuitive web application designed for managing and conducting multiple-choice question (MCQ) exams. 

The application offers a secure environment tailored for two distinct roles:
- **Student:** View available exams, take online tests in real-time, and get instant access to results.
- **Administrator:** Complete management of students, courses, exam creation, session tracking, and overall result analysis.

---

## 👥 Team & Collaboration

| Collaborator | Role / Responsibility | GitHub Profile |
| :--- | :--- | :--- |
| **Fiandrianana** | Student Side Development *(Student Portal)* | [@Fiandriananaprime](https://github.com/Fiandriananaprime) |
| **Fehizoro** | Admin Side Development *(Admin Dashboard)* | — |

---

## 🚀 Key Features

### 👨‍🎓 Student Portal
- **Authentication & Profile:** Secure authentication using JWT and user profile management.
- **Exam Catalog:** View available exams categorized by subject or course.
- **Online MCQ Engine:** Clean, smooth, and responsive interface to answer questions online.
- **Submission & Grading:** Instant answer submission with automated grade computation.
- **History & Results:** Access past exam attempts, scores, and track academic progress.

### 🛠️ Administrator Dashboard
- **Analytics Dashboard:** Overview of key statistics (total students, active exams, pass rates).
- **Student Management:** Full CRUD (Create, Read, Update, Delete) operations for student accounts.
- **Course & Subject Management:** Organize and structure examination curricula.
- **Exam & Question Builder:** Create exams, add/edit MCQ questions, and set marking schemes.
- **Results Inspection:** View detailed student scorecards and performance analytics.

---

## 🛠️ Tech Stack

- **Frontend Framework:** [React](https://react.dev/) (JSX)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Context API

---

## 💻 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/Fiandriananaprime/EduExam_front.git
cd EduExam_front
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file at the root of the project using `.env.example` as a template:

```env
VITE_API_URL=http://localhost:3001
```

> **Note:** Update `VITE_API_URL` if your backend API is running on a different port or domain.

### 4. Start the development server
```bash
npm run dev
```

The application will be accessible locally at the URL displayed by Vite (typically `http://localhost:5173`).

---

## 📁 Project Structure

```text
EduExam_front/
├── public/                 # Static public assets
├── src/
│   ├── api/                # API configuration and backend request handlers
│   ├── components/         # Reusable UI components (Buttons, Modals, Navbar, etc.)
│   ├── context/            # React Contexts (AuthContext, Global State)
│   ├── pages/              # Application views/pages (Login, Dashboard, ExamView, etc.)
│   ├── security/           # Protected routes and security logic
│   ├── App.jsx             # Root application component
│   ├── Route.jsx           # Central application routing configuration
│   ├── data.js             # Mock data / fallbacks
│   ├── App.css             # Global CSS styles
│   ├── index.css           # Tailwind CSS directives
│   └── main.jsx            # React entry point
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── eslint.config.js        # ES Lint configuration
├── index.html              # HTML entry template
├── package.json            # Dependencies and npm scripts
└── vite.config.js          # Vite configuration
```

---

## 📜 Project Context

This project was developed as part of an academic project to digitize and automate the multiple-choice examination process. The system strictly separates permissions between **Administrator** and **Student** roles to ensure examination security and integrity.
