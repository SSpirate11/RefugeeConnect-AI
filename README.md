# 🌍 RefugeeConnect AI

**Tagline:** From Displaced to Empowered: AI-Powered Integration for Refugees

[![Gemini 3 Hackathon](https://img.shields.io/badge/Gemini%203-Hackathon-blue)](https://gemini3.devpost.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Active](https://img.shields.io/badge/Status-Active-success.svg)](https://github.com)

---

## 📋 Overview

**RefugeeConnect AI** is an AI-powered platform that helps **122.6 million** displaced people worldwide translate credentials, navigate bureaucracy, learn languages, and rebuild their lives in new countries using **Google Gemini 3's** advanced multimodal AI capabilities.

### 🎯 The Problem

Refugees and displaced people face massive barriers:
- ❌ Educational credentials not recognized (Syrian doctor → Uber driver)
- ❌ Language barriers prevent accessing services
- ❌ Complex bureaucracy with no guidance
- ❌ Isolation and mental health struggles
- ❌ No path to professional integration

### ✨ Our Solution

RefugeeConnect AI provides **4 core AI-powered features**:

1. **🎓 Credential Translator** - Upload degrees/certificates → AI analyzes, translates, maps to local equivalents, generates professional portfolio
2. **📷 Camera Translation** - Point camera at signs/documents → Instant translation + contextual explanation  
3. **💬 AI Advocate** - 24/7 empathetic AI counselor for emotional support and guidance
4. **🧭 AI Navigator** - Chat assistant that explains complex bureaucratic processes step-by-step

## 🚀 Quick Start

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Redis 7+
- Google Gemini 3 API Key
# 🌍 RefugeeConnect AI

> **AI-powered platform helping displaced people translate credentials, navigate bureaucracy, and rebuild their lives using Google Gemini 3 multimodal AI.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/react-19.2-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/fastapi-latest-009688.svg)](https://fastapi.tiangolo.com/)

---

## 📋 Overview

**RefugeeConnect AI** addresses critical challenges faced by displaced people worldwide through 4 core AI-powered features:

1. **🎓 Credential Translator** - Analyzes foreign credentials, maps them to local equivalents, generates professional portfolios
2. **📷 Camera Translation** - Real-time OCR and translation of signs, documents, and forms
3. **💬 AI Advocate** - 24/7 empathetic AI counselor for emotional support via WebSocket chat
4. **🧭 AI Navigator** - Personalized bureaucracy assistant using life-graph profiling

---

## 🏗️ Architecture

### Tech Stack

**Backend (Python/FastAPI)**
- **Framework**: FastAPI with async/await support
- **Database**: SQLModel ORM with PostgreSQL (Docker) or SQLite (local)
- **Authentication**: JWT tokens with OAuth2 password flow
- **AI Integration**: Google Gemini 3 API family
- **File Processing**: Local file uploads, PDF generation with ReportLab

**Frontend (React/TypeScript)**
- **Framework**: React 19.2 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Build Tool**: Vite

**Infrastructure**
- **Containerization**: Docker Compose (backend, frontend, PostgreSQL)
- **Development**: Hot reload for both backend and frontend

### AI Models Used (Gemini 3 Family)

| Model | Purpose | Used In |
|-------|---------|---------|
| `gemini-3-pro-vision` | Multimodal vision tasks (OCR, document analysis) | Credential analysis, camera translation |
| `gemini-3-ultra` | Complex reasoning and text generation | Curriculum mapping, equivalency scoring |
| `gemini-3-flash` | Low-latency conversational responses | AI Advocate chat, Navigator queries |

---

## 📁 Project Structure

```
RefugeeConnect-AI/
├── backend/
│   ├── app/
│   │   ├── api/                      # API route handlers
│   │   │   ├── auth.py              # User registration/login (JWT)
│   │   │   ├── credentials.py       # Credential upload & analysis
│   │   │   ├── camera.py            # Image translation endpoints
│   │   │   ├── advocate.py          # WebSocket chat endpoint
│   │   │   └── navigator.py         # Life graph + form assistance
│   │   ├── services/                 # Business logic
│   │   │   ├── gemini_service.py    # Gemini 3 integration (vision + reasoning)
│   │   │   ├── voice_service.py     # Advocate chat processing (gemini-3-flash)
│   │   │   ├── navigator_service.py # Profile extraction + guidance (gemini-3-flash)
│   │   │   ├── pdf_service.py       # Portfolio PDF generation
│   │   │   └── mock_gemini.py       # Mock service (no API key needed)
│   │   ├── models.py                 # SQLModel database schemas
│   │   ├── database.py               # DB engine + session management
│   │   ├── auth.py                   # JWT token creation/validation
│   │   ├── schemas.py                # Pydantic request/response models
│   │   └── main.py                   # FastAPI app + CORS + lifespan
│   ├── requirements.txt              # Python dependencies
│   ├── Dockerfile                    # Backend container
│   └── uploads/                      # Local file storage
├── frontend/
│   ├── src/
│   │   ├── components/              
│   │   │   ├── FileUpload.tsx       # Credential upload UI
│   │   │   ├── CameraTranslate.tsx  # Camera/image translation UI
│   │   │   ├── Advocate.tsx         # WebSocket chat interface
│   │   │   ├── Navigator.tsx        # Form assistance chat
│   │   │   └── layout/              # Dashboard layout components
│   │   ├── pages/
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── Register.tsx         # Registration page
│   │   │   └── Dashboard.tsx        # Main dashboard
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Auth state management
│   │   └── App.tsx                  # React Router setup
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml                # Full stack orchestration
├── Makefile                          # Development commands
├── .env.example                      # Environment variables template
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Google Gemini API Key** (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))
- **Docker & Docker Compose** (optional, for containerized setup)

### Option 1: Local Development (Recommended for Development)

#### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cd ..
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run database migrations (auto-creates SQLite DB)
cd backend
python -c "from app.database import create_db_and_tables; create_db_and_tables()"

# Start backend server
uvicorn app.main:app --reload --port 8000
```

**Backend now running at:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

#### Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend now running at:** http://localhost:5173

### Option 2: Docker Compose (Full Stack)

```bash
# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start all services (backend, frontend, PostgreSQL)
docker-compose up --build

# Or use the Makefile
make install
make start
```

**Services:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- PostgreSQL: localhost:5432

---

## 🎯 Feature Breakdown

### 1. Credential Translator 🎓

**Flow:**
1. User uploads image of credential (degree, certificate, transcript)
2. **Gemini 3 Pro Vision** performs OCR + contextual understanding
3. Extracts: document type, institution, country, text content
4. **Gemini 3 Ultra** maps credential to target country equivalency
5. Generates gap analysis (missing modules, requirements)
6. Creates professional PDF portfolio

**Endpoints:**
- `POST /api/credentials/upload` - Upload and analyze credential
- `POST /api/credentials/portfolio` - Generate PDF portfolio

**Models Used:**
- Vision: `gemini-3-pro-vision` (document analysis)
- Reasoning: `gemini-3-ultra` (curriculum mapping)

**Example Response:**
```json
{
  "credential_id": "uuid",
  "analysis": {
    "document_type": "Bachelor's Degree",
    "institution": "Damascus University",
    "country": "Syria",
    "extracted_text": "..."
  },
  "mapping": {
    "equivalency_score": 0.85,
    "target_degree": "Bachelor of Science (Germany)",
    "missing_modules": ["Advanced Statistics", "Research Methods"],
    "recommendations": ["Take bridging course", "Get degree evaluated by anabin"]
  }
}
```

### 2. Camera Translation 📷

**Flow:**
1. User uploads image or uses camera
2. **Gemini 3 Pro Vision** extracts all visible text
3. Detects source language automatically
4. Translates to target language (default: English)
5. Provides contextual explanation

**Endpoints:**
- `POST /api/camera/translate` - Translate image text
- `POST /api/camera/translate-text` - Text-only translation

**Models Used:**
- `gemini-3-pro-vision` (OCR + translation in single multimodal call)

**Example Response:**
```json
{
  "original_text": "Aufenthaltstitel beantragen",
  "detected_language": "German",
  "translated_text": "Apply for residence permit",
  "contextual_explanation": "This is an administrative sign directing you to apply for a residence permit",
  "confidence": 0.95
}
```

### 3. AI Advocate 💬

**Flow:**
1. User connects via WebSocket at `/ws/advocate/{client_id}`
2. Real-time bidirectional chat
3. **Gemini 3 Flash** generates empathetic, culturally-aware responses
4. Conversation history maintained per session
5. Provides emotional support + practical guidance

**WebSocket Protocol:**
```json
// Client sends:
{"text": "I feel overwhelmed by the asylum process"}

// Server responds:
{
  "type": "ai_response",
  "text": "I understand this is incredibly challenging. Let's break it down step by step..."
}
```

**Models Used:**
- `gemini-3-flash` (low-latency conversational AI)

### 4. AI Navigator 🧭

**Flow:**
1. **Onboarding**: Extract "Life Graph" from conversational input
2. Store structured profile (nationality, profession, status, needs)
3. **Query Mode**: Answer bureaucracy questions using profile context
4. Provide personalized, step-by-step guidance

**Endpoints:**
- `POST /api/navigator/onboard` - Create user profile from conversation
- `GET /api/navigator/profile/me` - Get authenticated user's profile
- `POST /api/navigator/ask` - Ask form/bureaucracy questions

**Models Used:**
- `gemini-3-flash` (profile extraction + guidance generation)

**Life Graph Example:**
```json
{
  "name": "Ahmad Hassan",
  "nationality": "Syria",
  "current_country": "Germany",
  "profession": "Doctor",
  "education": "MD from Damascus University",
  "status": "asylum_seeker",
  "languages": ["Arabic", "English"],
  "needs": ["credential recognition", "work permit"]
}
```

---

## 🔐 Authentication

**JWT-based authentication** with OAuth2 password flow:

1. **Register**: `POST /api/auth/register`
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword",
     "full_name": "John Doe",
     "nationality": "Syria"
   }
   ```

2. **Login**: `POST /api/auth/token` (OAuth2 form data)
   - Returns: `{"access_token": "...", "token_type": "bearer"}`

3. **Protected Routes**: Include header `Authorization: Bearer <token>`

4. **Get Current User**: `GET /api/auth/me`

---

## 🗄️ Database Schema

### Models (SQLModel)

**User**
- `id` (UUID, primary key)
- `email` (unique, indexed)
- `password_hash` (bcrypt)
- `full_name`
- `nationality`, `current_country`
- `registered_at` (timestamp)

**Credential**
- `id` (UUID, primary key)
- `user_id` (foreign key → User)
- `original_filename`
- `file_path` (local storage)
- `extracted_text` (OCR result)
- `analysis_json` (Gemini analysis result)
- `created_at` (timestamp)

**NavigatorProfile**
- `id` (UUID, primary key)
- `user_id` (foreign key → User, unique)
- `profile_json` (Life Graph as JSON string)
- `created_at`, `updated_at` (timestamps)

---

## 🧪 Testing

### Manual Testing (Using Makefile)

```bash
# Test server health
make test-health

# Test authentication
make test-auth

# Test credential upload
make test-credentials

# Test camera translation
make test-camera

# Test all endpoints
make test-all
```

### Using API Docs (Interactive)

1. Start backend: `uvicorn app.main:app --reload --port 8000`
2. Open browser: http://localhost:8000/docs
3. Use Swagger UI to test all endpoints interactively

### Using curl

```bash
# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test123"

# Upload credential (requires token)
curl -X POST http://localhost:8000/api/credentials/upload \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@/path/to/credential.jpg"
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Required: Google Gemini API Key
GEMINI_API_KEY=your_api_key_here

# Database (auto-configured for Docker, use SQLite for local dev)
DATABASE_URL=sqlite:///./refugeeconnect.db
# Or for PostgreSQL:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/refugeeconnect

# JWT Secret (change in production!)
JWT_SECRET=supersecretkeyshouldbechangedsomeday

# Optional: AWS S3 (not implemented in current version)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# S3_BUCKET_NAME=
```

### Mock Mode (No API Key Required)

If `GEMINI_API_KEY` is not set, the app automatically uses **mock services** with hardcoded responses. Useful for:
- Testing API structure
- Frontend development without API costs
- CI/CD environments

---

## 📦 Deployment

### Backend (Railway / Render / Fly.io)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables on platform:
# - GEMINI_API_KEY
# - DATABASE_URL (use managed PostgreSQL)
# - JWT_SECRET

# Run with gunicorn (production)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (Vercel / Netlify)

```bash
cd frontend

# Build for production
npm run build

# Deploy dist/ folder to Vercel/Netlify
# Set environment variable: VITE_API_URL=https://your-backend.com
```

### Docker Deployment

```bash
# Build and run full stack
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🛠️ Development

### Running Tests

```bash
# Backend tests
cd backend
source .venv/bin/activate
pytest tests/

# Frontend tests (if implemented)
cd frontend
npm run test
```

### Code Quality

```bash
# Python linting
cd backend
flake8 app/

# TypeScript type checking
cd frontend
npm run build  # Will fail if type errors exist
```

### Hot Reload

Both backend and frontend support hot reload:
- **Backend**: `uvicorn app.main:app --reload`
- **Frontend**: `npm run dev` (Vite HMR)

---

## 🐛 Troubleshooting

### Common Issues

**1. "GEMINI_API_KEY not set" warning**
- Expected behavior if running in mock mode
- To use real AI: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

**2. Database connection errors**
- For local dev, uses SQLite (no setup needed)
- For Docker, ensure PostgreSQL container is running: `docker-compose up db`

**3. CORS errors in frontend**
- Backend allows all origins in development (`allow_origins=["*"]`)
- For production, update `app/main.py` origins list

**4. WebSocket connection fails**
- Ensure backend is running
- Check browser console for connection errors
- WebSocket endpoint: `ws://localhost:8000/ws/advocate/{client_id}`

**5. File upload fails**
- Check `backend/uploads/` directory exists and is writable
- Verify file size limits in FastAPI config

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Welcome message | No |
| GET | `/health` | Health check | No |
| POST | `/api/auth/register` | Create user account | No |
| POST | `/api/auth/token` | Login (get JWT) | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/credentials/upload` | Upload credential | Yes |
| POST | `/api/credentials/portfolio` | Generate PDF | Yes |
| POST | `/api/camera/translate` | Translate image | Yes |
| POST | `/api/camera/translate-text` | Translate text | Yes |
| WS | `/ws/advocate/{client_id}` | AI Advocate chat | No* |
| POST | `/api/navigator/onboard` | Create life graph | Yes |
| GET | `/api/navigator/profile/me` | Get user profile | Yes |
| POST | `/api/navigator/ask` | Ask Navigator | Yes |

*WebSocket auth not implemented in current version

---

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` file for details.

---

## 🙏 Acknowledgments

- **Google Gemini 3 API** for powering AI features
- **FastAPI** for excellent async Python framework
- **React** and **Vite** for modern frontend development
- Open source community for amazing tools

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check API documentation at `/docs` endpoint
- Review code comments in source files

---

**Built with ❤️ for displaced people worldwide** 🌍
## 📖 Key Features
