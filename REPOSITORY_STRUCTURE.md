# Repository Structure

```text
/
├── README.md
├── PROJECT_PLAN.md
├── ARCHITECTURE.md
├── TASK_BOARD.md
├── GEMINI_AGENTS.md
├── REPOSITORY_STRUCTURE.md
├── EXECUTION_RULES.md
├── .env.local.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── package.json
│
├── docs/                   # Agent reports and architectural diagrams
│   ├── planning/
│   └── implementation/
│
├── supabase/               # Database migrations and config
│   ├── migrations/
│   └── config.toml
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── auth/           # Login, Register, Callback
│   │   └── (dashboard)/    # Protected routes
│   │       ├── layout.tsx
│   │       ├── generate/
│   │       ├── drafts/
│   │       ├── settings/
│   │       └── profile/
│   │
│   ├── actions/            # Next.js Server Actions
│   │   ├── auth.ts
│   │   ├── settings.ts
│   │   ├── generate.ts
│   │   ├── drafts.ts
│   │   └── publish.ts
│   │
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Sidebar, Navbar
│   │   ├── generate/       # Form components
│   │   ├── drafts/         # Post cards, grid
│   │   └── shared/         # Common components (Toasts, etc.)
│   │
│   ├── lib/                # Shared business logic
│   │   ├── supabase/
│   │   ├── openai/         # Client and system prompts
│   │   ├── buffer/         # API wrappers
│   │   ├── encryption/     # AES utilities
│   │   └── utils.ts        # CN and formatting helpers
│   │
│   ├── types/              # TypeScript definitions
│   │   ├── database.ts     # Supabase types
│   │   └── index.ts        # App types
│   │
│   └── hooks/              # Custom React hooks
```
