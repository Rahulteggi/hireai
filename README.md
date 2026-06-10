# 💼 HireAI — AI Job Application Assistant

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

> Paste a job description, upload your resume — get a tailored cover letter, resume bullet rewrites, and ATS keyword analysis in seconds.

## 🚀 Live Demo
[https://hireai-demo.vercel.app](https://hireai-demo.vercel.app)

---

## ✨ Features

- **Cover Letter Generator** — Tailored letter matching the job's tone and requirements
- **Resume Bullet Rewriter** — Rewrites your bullets to match the job description
- **ATS Keyword Analyzer** — Shows which keywords from the JD are missing from your resume
- **Match Score** — Rates your resume fit (0–100%) against the job posting
- **Interview Q&A Prep** — Generates likely interview questions based on the role
- **Export** — Download cover letter as PDF or copy to clipboard
- **Saved Applications** — Track your applications with notes and status

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| AI | OpenAI GPT-4o (structured outputs) |
| PDF Parsing | pdf-parse (resume upload) |
| Auth | Clerk |
| DB | MongoDB + Mongoose |

---

## 📂 Project Structure

```
hireai/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx     # Saved applications
│   │   │   ├── Analyze.tsx       # Main analysis page
│   │   │   └── Results.tsx       # Generated content
│   │   └── components/
│   │       ├── JobInput.tsx      # JD paste + upload
│   │       ├── ResumeUpload.tsx  # PDF uploader
│   │       ├── ScoreCard.tsx     # Match % + keywords
│   │       └── CoverLetter.tsx   # Editable letter output
└── server/
    ├── src/
    │   ├── routes/
    │   │   └── analyze.js        # Main AI endpoint
    │   ├── prompts/
    │   │   ├── coverLetter.js    # Cover letter prompt
    │   │   ├── keywords.js       # ATS keyword prompt
    │   │   └── interview.js      # Interview prep prompt
    │   └── utils/
    │       └── pdfExtract.js     # Resume text extraction
    └── package.json
```

---

## 🧠 AI Pipeline

```
User pastes Job Description + uploads Resume PDF
                    ↓
          Resume text extracted (pdf-parse)
                    ↓
     ┌──────────────┬──────────────┬──────────────┐
     ↓              ↓              ↓              ↓
Cover Letter   Bullet Rewrites  ATS Keywords  Interview Qs
 (GPT-4o)       (GPT-4o)        Analysis      (GPT-4o)
                    ↓
          Results displayed + exportable
```

---

## 🏃 Getting Started

```bash
git clone https://github.com/Rahulteggi/hireai.git
cd hireai

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

`server/.env`:
```env
OPENAI_API_KEY=sk-...
MONGODB_URI=mongodb://localhost:27017/hireai
PORT=5000
CLIENT_URL=http://localhost:3000
```

`client/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

```bash
# Run both
cd server && npm run dev
cd client && npm run dev
```

---

## 📄 License
MIT © [Rahul Teggi](https://github.com/Rahulteggi)
