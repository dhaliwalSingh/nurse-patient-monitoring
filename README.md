# 🩺 Patient-Nurse Monitoring App

A full-stack, AI-powered Patient-Nurse Monitoring System designed to streamline health tracking, emergency alerts, and communication between patients and nurse practitioners. Built using MERN stack, GraphQL, and OpenAI/Gemini for intelligent health insights.

## 🚀 Features

### 🧑‍⚕️ For Nurses:
- View and manage vitals submitted by patients
- Access clinical history and patient symptoms
- AI-powered suggestions based on vitals & symptoms
- Enter clinical notes and resolve alerts
- View patient-submitted emergency alerts

### 👤 For Patients:
- Submit daily vitals (e.g. heart rate, temperature, BP)
- Report symptoms (free text or checklist)
- Raise emergency alerts
- Receive AI feedback on symptoms using Gemini

### 🤖 AI Functionality:
- **Nurse Assistant**: Provides condition suggestions based on symptoms and vitals (OpenAI GPT)
- **Patient AI Chat**: Simplified symptom insights using Gemini (Google)

## 🧱 Tech Stack

| Layer        | Tech Used |
|--------------|-----------|
| Frontend     | React 19, Vite, TailwindCSS, Module Federation |
| Backend      | Express.js, Node.js, GraphQL (Apollo Server) |
| Database     | MongoDB (Mongoose ODM) |
| Auth         | JWT (Role-based: Nurse / Patient) |
| AI Models    | OpenAI GPT-4, Gemini API |
| Deployment   | Vercel (Frontend), Render (Backend) |
| DevOps       | GitHub Actions / Azure DevOps (CI/CD Ready) |

## 📁 Microfrontend Architecture

- `shell`: Hosts the layout and routes
- `auth-frontend`: Handles login/signup
- `nurse-frontend`: Nurse dashboard, AI suggestions, alerts
- `patient-frontend`: Vitals submission, symptoms, emergency alert
- Shared backend GraphQL API (modular schema, resolvers)

## 📸 Screenshots

> Add screenshots or screen recordings here

## 🛠️ Installation

### Clone the project

```bash
git clone https://github.com/<your-org>/patient-nurse-monitoring.git
cd patient-nurse-monitoring
