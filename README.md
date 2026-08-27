# Exam Hub

Exam Hub is a web application for managing multiple-choice exams (QCM). Administrators can manage students, courses, exams, questions, and results, while students can access available exams, take them online, and view their results.

## 👥 Collaborators

| Collaborator | Responsibility |
|---|---|
| **Fiandrianana** | Student side |
| **Fehizoro** | Admin side |

## 🚀 Getting Started

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

Create a `.env` file at the root of the project:

```env
VITE_API_URL=http://localhost:3001
```

Set `VITE_API_URL` to the URL of the backend API you are using.

A `.env.example` file is provided as a reference.

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the URL displayed by Vite, usually:

```text
http://localhost:5173
```

## 🛠️ Technologies

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React
- JavaScript / JSX

## 📁 Project Structure

```text
EduExam_front/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── security/
│   ├── App.jsx
│   ├── Route.jsx
│   ├── data.js
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

### Main directories

- `api/` — API communication and requests.
- `components/` — Reusable UI components.
- `context/` — Shared React state and application context.
- `pages/` — Application pages for the different user areas.
- `security/` — Authentication and protected-route logic.

## 🎯 Main Features

### Student

- Access available exams.
- Take QCM exams online.
- Submit answers.
- View exam results.

### Admin

- Access the dashboard.
- Manage students.
- Manage courses.
- Manage exams.
- Manage exam questions.
- View exam results.

## 📄 Project Context

This project was developed as part of an academic project to digitize multiple-choice examinations. The application separates access between two roles: **Administrator** and **Student**.
