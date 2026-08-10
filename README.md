# TomeTalk

TomeTalk is an AI-powered platform for having real-time voice conversations with your books. Upload a PDF and it's chunked, embedded, and turned into an interactive entity you can talk to out loud — ask questions, request summaries, and get natural-sounding spoken answers from a voice persona of your choice.

## 📋 Table of Contents

1. ✨ [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)

## <a name="introduction">✨ Introduction</a>

Built with Next.js 16 and MongoDB, TomeTalk transforms uploaded PDFs into interactive entities using natural voice synthesis. Choose from custom ElevenLabs personas to chat with your library, request summaries, and view live transcripts — all wrapped in a Shadcn UI with Better Auth authentication.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **[Next.js](https://nextjs.org/docs)** — full-stack React framework handling routing, server-side rendering, and API routes.
- **[TypeScript](https://www.typescriptlang.org/)** — static typing for a maintainable, robust codebase.
- **[MongoDB](https://www.mongodb.com/docs/)** + **[Mongoose](https://mongoosejs.com/)** — document storage for user libraries, book metadata, and conversation transcripts.
- **[Better Auth](https://www.better-auth.com/docs)** — self-hosted authentication and session management, with a Stripe plugin powering billing.
- **[Vapi](https://docs.vapi.ai/)** — real-time, low-latency voice AI powering the back-and-forth conversations with uploaded books.
- **[ElevenLabs](https://elevenlabs.io/docs)** — lifelike text-to-speech for voice previews and AI persona playback.
- **[Shadcn UI](https://ui.shadcn.com/)** — accessible, themeable components built on Tailwind CSS and Radix UI.
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** — file storage for uploaded PDFs.

## <a name="features">🔋 Features</a>

👉 **PDF Upload & Ingestion** — upload PDF books with automated text extraction, intelligent chunking, and high-dimensional embeddings for precise context retrieval.

👉 **Voice-First Conversations** — engage in natural, real-time voice dialogues with your uploaded books via Vapi.

👉 **AI Voice Personas** — choose from a variety of AI personalities and hear instant high-fidelity previews powered by ElevenLabs.

👉 **Smart Summaries & Insights** — extract the essence of any chapter or request deep-dive summaries.

👉 **Session Transcripts** — a complete, auto-generated text record of every vocal interaction.

👉 **Library Management** — organize and search through personal uploads or the global collection.

👉 **Auth & Subscriptions** — secure email/social login paired with a billing system for premium features.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally.

**Prerequisites**

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/)

**Cloning the Repository**

```bash
git clone <your-repository-url>
cd tometalk
```

**Installation**

```bash
npm install
```

**Set Up Environment Variables**

Create a `.env` file in the project root:

See [`.env.example`](./.env.example) for the full list, reproduced here:

```env
NODE_ENV='development'
NEXT_PUBLIC_BASE_URL=

# BETTER AUTH
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# STRIPE (billing, via the Better Auth Stripe plugin)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_STANDARD_PRICE_ID=
STRIPE_PRO_PRICE_ID=

# VERCEL BLOB
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_BLOB_HOSTNAME= # optional: only needed if the Blob store is rotated/recreated

# MONGODB
MONGODB_URI=

# VAPI
NEXT_PUBLIC_VAPI_API_KEY=
NEXT_PUBLIC_ASSISTANT_ID=
VAPI_SERVER_SECRET= # set as the assistant's "Server URL Secret" in the Vapi dashboard

# Reserved for future use — not currently read by any code path.
GOOGLE_GEMINI_API_KEY=
ELEVENLABS_API_KEY=
```

`BETTER_AUTH_SECRET` must be a high-entropy string of at least 32 characters (e.g. `openssl rand -hex 32`). Get other credentials at: [Stripe](https://dashboard.stripe.com), [Vercel](https://vercel.com), [MongoDB](https://www.mongodb.com), [Vapi](https://vapi.ai).

Book search currently uses MongoDB `$text`/regex search, not embeddings — `GOOGLE_GEMINI_API_KEY` and `ELEVENLABS_API_KEY` are unused placeholders for a possible future feature, not a currently active integration.

For Stripe billing, create two recurring Prices in test mode (Standard, Pro) and put their IDs in `STRIPE_STANDARD_PRICE_ID`/`STRIPE_PRO_PRICE_ID`, then register a webhook endpoint at `https://your-domain.com/api/auth/stripe/webhook` listening for `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, and `customer.subscription.deleted`, and put its signing secret in `STRIPE_WEBHOOK_SECRET`.

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the project.
