# NyayLink

NyayLink is a Next.js platform for Indian legal help. It combines guided legal
intake, lawyer consultation discovery, workflow tools, case tracking, and a
service layer designed for OCR, payments, auth, and data storage.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Product Routes

- `/` overview and architecture summary
- `/intake` guided intake and legal brief generation
- `/assistant` legal guidance desk
- `/lawyers` lawyer discovery and consultation booking
- `/cases` matter tracking dashboard
- `/tools` OCR/document/legal workflow modules

## API Routes

- `GET /api/health`
- `GET /api/intake`
- `POST /api/intake`
- `POST /api/chat`
- `GET /api/lawyers?city=Delhi&category=Criminal&maxPrice=1200&urgentOnly=true`
- `POST /api/consultations`
- `POST /api/payments`
- `GET /api/cases`
- `GET /api/tools`
- `POST /api/documents/scan`

The backend is structured like a production service:
validation, typed request models, backend service functions, generated IDs,
timestamps, health checks, payment orders, case data, and clear error responses.

## Production Notes

Before public launch, connect verified lawyer onboarding, authentication,
payments, secure file storage, audit logging, OCR processing, compliance
reviews, and review by qualified Indian legal professionals.
