# Caseway

Caseway is a chat-first AI filing copilot for Indian legal and compliance
workflows. The primary experience is a guided filing conversation that collects
missing information, chooses a realistic government integration route, prepares
a filing packet, and waits for consent before submission handoff.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For live Legal Desk responses, create `.env.local`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.6-luna
```

Caseway defaults to `gpt-5.6-luna` for lower-cost legal chat and intake extraction.
Set `OPENAI_MODEL` to another supported model if you want higher reasoning quality.

## Product Routes

- `/` redirects to the filing chat
- `/intake` guided intake and legal brief generation
- `/assistant` AI filing copilot for tax, consumer, notice, and court packets
- `/lawyers` supporting advocate discovery and consultation booking
- `/cases` supporting matter tracking dashboard
- `/tools` supporting OCR/document/legal workflow modules

## API Routes

- `GET /api/health`
- `GET /api/intake`
- `POST /api/intake`
- `POST /api/chat`
- `GET /api/agent`
- `POST /api/agent`
- `GET /api/integrations`
- `POST /api/filings/submit`
- `GET /api/lawyers?city=Delhi&category=Criminal&maxPrice=1200&urgentOnly=true`
- `POST /api/consultations`
- `POST /api/payments`
- `GET /api/cases`
- `GET /api/tools`
- `POST /api/documents/scan`

The backend is structured like a production service:
validation, typed request models, backend service functions, guided agent
workflows, researched Indian government integration routes, consent-gated filing
submission adapters, generated IDs, timestamps, health checks, payment orders,
case data, and clear error responses.

## Production Notes

Before public launch, connect verified lawyer onboarding, authentication,
payments, secure file storage, audit logging, OCR processing, compliance
reviews, and review by qualified Indian legal professionals.
