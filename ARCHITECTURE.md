# Architecture: AI Content Publisher SaaS

## 1. System Architecture
A high-performance SaaS platform built with **Next.js 15**, focusing on security, server-side execution, and a "Bring Your Own Key" (BYOK) model.

### Tech Stack
- **Frontend:** Next.js 15 (App Router), React Server Components (RSC), Tailwind CSS, shadcn/ui.
- **Backend:** Next.js Server Actions (all mutations and API interactions).
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security).
- **Security:** AES-256-GCM authenticated encryption for secret storage.

## 2. API & Data Flow
The application architecture is strictly decoupled into three primary layers:

### A. Presentation Layer (Client)
- Responsible for form state and optimistic UI updates.
- Never interacts with external APIs (OpenAI/Buffer) directly.
- Communicates only with Server Actions.

### B. Action Layer (Server)
- **Settings Action:** Handles brand profile management and key encryption.
- **Generation Action:** Decrypts OpenAI keys and coordinates with the OpenAI Service.
- **Publishing Action:** Decrypts Buffer tokens and coordinates with the Publishing Adapter.

### C. Service Layer (Internal)
- **OpenAI Service:** Logic for prompt construction and GPT-4o interaction.
- **Publishing Adapter:** A Strategy-pattern based layer that wraps third-party publishing APIs (Buffer, etc.).

## 3. Database Architecture
Utilizes Supabase for persistent storage with a focus on auditability and strict user isolation.

- **`profiles`:** Base user identity.
- **`brands`:** Granular identity settings (Tone, Personality).
- **`integrations`:** Encrypted secrets storage (`provider`, `encrypted_value`).
- **`content_posts`:** Result of AI generation and publishing state.
- **`workflow_logs`:** Audit trail for all system actions.

## 4. Security Model
### Encryption at Rest
User API keys are encrypted using **AES-256-GCM**.
- **Key Derivation:** An app-level `ENCRYPTION_KEY` is used to derive a 32-byte secret.
- **Format:** `iv:authTag:ciphertext`.
- **Constraint:** Decryption occurs *strictly* within server actions. Decrypted keys never exist in the client-side state.

### Row Level Security (RLS)
Every table in the database has RLS enabled. Policies ensure that:
- Users can only read their own data.
- Users can only update/delete their own data.
- Triggers automatically populate user profiles on signup.

## 5. Future Readiness
- **Multi-Platform:** The `PublishingAdapter` interface allows adding direct Facebook or LinkedIn integrations by simply creating a new adapter class.
- **Scalability:** Next.js Server Components minimize client-side bundle size, ensuring fast loads even as features grow.
