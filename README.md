# 📋 Job Application Tracker

A full-stack web app to track job applications during your job search.

## 🔗 Live Demo
- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://job-tracker-api.onrender.com
- **Health Check:** https://job-tracker-api.onrender.com/health

## ✨ Features
- Add, edit, and delete job applications
- Filter by status: Applied / Interviewing / Offer / Rejected
- Search by company name or job title
- Status summary dashboard
- Fully responsive dark UI

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (hosted on Render) |
| ORM | Prisma 7 with migrations |
| Deployment | Vercel (frontend) + Render (backend + DB) |

## 📸 Screenshots
<!-- Add your screenshots here -->
![Main View](screenshots/main.png)
![Add Application](screenshots/add-form.png)

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### Setup

1. Clone the repo
```bash
   git clone https://github.com/YOURUSERNAME/job-tracker.git
   cd job-tracker
```

2. Setup the server
```bash
   cd server
   npm install
   cp .env.example .env
   # Fill in your DATABASE_URL in .env
   npx prisma migrate dev
   npm run dev
```

3. Setup the client
```bash
   cd client
   npm install
   cp .env.example .env
   npm run dev
```

4. Open http://localhost:5173

## 📡 API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | /applications | List all (supports ?status= and ?search=) |
| GET | /applications/:id | Get single application |
| POST | /applications | Create new application |
| PATCH | /applications/:id | Update application |
| DELETE | /applications/:id | Delete application |

## 🗄️ Data Model
| Field | Type | Notes |
|---|---|---|
| id | Integer | Auto-increment primary key |
| company_name | String | Required |
| job_title | String | Required |
| job_type | Enum | FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT, FREELANCE |
| status | Enum | APPLIED, INTERVIEWING, OFFER, REJECTED |
| applied_date | DateTime | Required |
| notes | String? | Optional |
| created_at | DateTime | Auto-set on create |
| updated_at | DateTime | Auto-set on update |
