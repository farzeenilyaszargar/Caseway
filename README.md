# NyayLink

NyayLink is a Next.js prototype for Indian legal help. It combines a mock AI legal
assistant, lawyer consultation discovery, workflow tools, and a production-style
API layer that can later be connected to real AI, OCR, payments, auth, and data
storage.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Product Routes

- `/` overview and architecture summary
- `/assistant` AI legal intake chat
- `/lawyers` lawyer discovery and consultation booking
- `/tools` OCR/document/legal workflow modules

## API Routes

- `GET /api/health`
- `POST /api/chat`
- `GET /api/lawyers?city=Delhi&category=Criminal&maxPrice=1200&urgentOnly=true`
- `POST /api/consultations`
- `GET /api/tools`
- `POST /api/documents/scan`

The backend is intentionally mocked but structured like a production service:
validation, typed request models, backend service functions, generated IDs,
timestamps, and clear error responses.

## Production Notes

This project is demo-ready, not legal-service ready. Before real launch, add
lawyer verification, auth, payments, secure file storage, audit logging, real
OCR, real AI moderation/guardrails, and review by qualified Indian legal
professionals.
