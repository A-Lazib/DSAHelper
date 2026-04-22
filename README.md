# DSA Helper (Proof of Concept)

Simple full-stack TypeScript app for DSA practice.

- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- Data source: hardcoded problems in the backend
- OpenAI optional (falls back to local heuristics if missing)
- No database required

## What the app does 

- Choose a problem
- Write Python code in a Monaco editor
- Get local mock outputs for:
  - Debug
  - Feedback
  - Hints

## Run locally

### 1) Install

From project root:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 2) Server env

Create and keep this in server/.env:

```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=
```

If `OPENAI_API_KEY` is set, the backend uses GPT-powered debug/feedback/hints.
If not set, or if there are no tokens avalaible to use, there will be an error

### 3) Start backend

```bash
cd server
npm run dev
```

Backend should be available at:

- http://localhost:5000/health

### 4) Start frontend (second terminal)

```bash
cd client
npm run dev
```

Frontend usually runs on:

- http://localhost:5173

If 5173 is busy, Vite will pick another port and print it in the terminal.

## API endpoints

- `GET /api/problems`
- `GET /api/problems/:id`
- `POST /api/debug`
- `POST /api/feedback`
- `POST /api/hint`
- `GET /health`

## Key files

### Backend

- `server/src/index.ts` — Express app setup
- `server/src/routes/index.ts` — API routes
- `server/src/controllers/index.ts` — request handlers
- `server/src/services/*.ts` — debug/feedback/hint logic
- `server/src/data/problems.ts` — problem dataset

### Frontend

- `client/src/App.tsx` — app flow
- `client/src/components/ProblemDescription.tsx` — question panel
- `client/src/components/CodeEditor.tsx` — Monaco Python editor
- `client/src/services/api.ts` — API client

## Add a new problem

Edit `server/src/data/problems.ts` and add one entry to the problem map.

## Notes

- This repo is intentionally simple for learning and interview explanation.
- OpenAI is optional, not required to run locally.
- There is no DB setup required.
