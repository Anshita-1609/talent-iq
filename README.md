# Talent-IQ

**Full-stack online technical interview and coding practice platform.**

Conduct live 1-on-1 coding interviews with video, chat, and a shared editor—or practice DSA problems solo. Run code against test cases, get instant pass/fail feedback, and receive AI-powered analysis on correctness, complexity, and improvements.

![Demo App](./frontend/public/screenshot-for-readme.png)

---

## Features

| Feature | Description |
|--------|-------------|
| **Code editor** | Monaco Editor (VS Code–style) with multi-language support |
| **Live interviews** | 1-on-1 rooms with Stream Video (mic, camera, screen share) |
| **Real-time chat** | Session messaging via Stream Chat |
| **Code execution** | Run code via [Piston API](https://github.com/engineer-man/piston) or backend `/api/code/execute` |
| **Test cases** | Auto pass/fail with confetti on success |
| **AI analysis** | Groq (Llama 3.3 70B) or OpenAI (GPT-4o-mini) feedback on code quality |
| **Practice mode** | Solo coding on curated problems (e.g. Two Sum) |
| **Sessions** | Create, invite, join, and end interview sessions (max 2 participants) |
| **Dashboard** | Active sessions, recent history, and stats |
| **Auth** | [Clerk](https://clerk.com) or mock auth for local development |
| **Background jobs** | User sync/cleanup via [Inngest](https://www.inngest.com) |

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 19, Vite 7, React Router 7, Tailwind CSS 4, DaisyUI, Monaco Editor, TanStack Query, Axios |
| **Backend** | Node.js, Express 5, JSON file storage (`sessions.json`, `users.json`) |
| **Realtime** | Stream Video SDK, Stream Chat SDK |
| **AI** | Groq API / OpenAI API |
| **Auth** | Clerk (optional mock mode) |
| **Jobs** | Inngest |

---

## Project Structure

```
talent-iq/
├── backend/
│   ├── data/                 # sessions.json, users.json
│   └── src/
│       ├── controllers/      # session, chat, code analysis, code execution
│       ├── routes/           # REST API routes
│       ├── models/           # Session, User
│       ├── middleware/       # protectRoute
│       └── lib/              # db, env, stream, inngest, codeRunner
├── frontend/
│   └── src/
│       ├── pages/            # Home, Dashboard, Problem, Session, JoinSession
│       ├── components/       # Editor, Output, VideoCall, Navbar, etc.
│       ├── hooks/            # useSessions, useStreamClient
│       └── lib/              # piston, axios, mockAuth, problemUtils
├── README.md
├── DEPLOYMENT.md
├── CODE_ANALYSIS_SETUP.md
└── package.json              # Root scripts (dev, build, install-all)
```

---

## Prerequisites

- **Node.js** 18+ and npm
- Accounts/API keys (as needed):
  - [Clerk](https://clerk.com) — authentication (optional; mock auth works locally)
  - [Stream](https://getstream.io) — video and chat
  - [Groq](https://console.groq.com) or [OpenAI](https://platform.openai.com) — AI code analysis
  - [Inngest](https://www.inngest.com) — background jobs (optional for basic dev)
  - Piston — public API for code execution (no key required for default endpoint)

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Anshita-1609/talent-iq.git
cd talent-iq
```

### 2. Install dependencies

```bash
npm run install-all
```

Or install separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Environment variables

**Backend** — copy `backend/.env.example` to `backend/.env`:

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

DB_URL=your_mongodb_connection_url

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AI analysis (at least one recommended)
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your_stream_api_key
```

> **Note:** Without valid Clerk keys, the app can run in **mock auth** mode using predefined demo users. See `frontend/src/data/mockUsers.js`.

### 4. Run the application

**Option A — both servers from root:**

```bash
npm run dev
```

**Option B — separate terminals:**

```bash
# Terminal 1 — Backend (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/sessions` | Create interview session |
| `GET` | `/api/sessions/active` | List active sessions |
| `GET` | `/api/sessions/my-recent` | User's completed sessions |
| `GET` | `/api/sessions/:id` | Get session by ID |
| `POST` | `/api/sessions/:id/join` | Join as participant |
| `POST` | `/api/sessions/:id/end` | End session |
| `POST` | `/api/code/execute` | Execute code (protected) |
| `POST` | `/api/code/analyze` | AI code analysis |
| `GET` | `/api/chat/token` | Stream chat token |

---

## How It Works

### Live interview flow

1. Host creates a session (problem + difficulty) from the dashboard.
2. Host shares the invite link (`/join/:sessionId`).
3. Participant joins — room locks at 2 users.
4. Both use video, chat, and the shared code editor.
5. Either user runs code; output and AI analysis appear in the output panel.
6. Host ends the session when finished.

### Practice mode

1. Go to **Problems** from the dashboard.
2. Open a problem (e.g. Two Sum).
3. Write code, click **Run Code**.
4. View execution output and **AI Analysis** (correctness, complexity, suggestions).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run install-all` | Install root, backend, and frontend dependencies |
| `npm run dev` | Run backend + frontend concurrently |
| `npm run build` | Build frontend for production |
| `npm start` | Start production backend (serves built frontend when `NODE_ENV=production`) |

---

## Documentation

| File | Purpose |
|------|---------|
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deploy to Vercel + Render |
| [CODE_ANALYSIS_SETUP.md](./CODE_ANALYSIS_SETUP.md) | AI analysis setup and troubleshooting |
| [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) | Usage workflows |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | Technical implementation notes |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Detailed file tree |

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting the frontend on Vercel and the backend on Render.

Production build from the repo root:

```bash
npm run build
npm start
```

---

## Security Notes

- Never commit `.env` files or API keys.
- AI and Stream credentials stay on the backend only.
- Code execution uses sandboxed Piston or a timed local runner (10s limit).
- Sessions are limited to **one host + one participant**.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to your fork and open a Pull Request.

---

## License

ISC

---

## Author

**Anshita** — [GitHub @Anshita-1609](https://github.com/Anshita-1609)

---

<p align="center">Built for remote technical interviews, campus prep, and collaborative coding practice.</p>
