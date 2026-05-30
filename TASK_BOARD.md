# Task Board

## Epic 1: Foundation (Day 1-2)
| Feature | Task | Priority | Dependency | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|
| Project Init | Setup Next.js + shadcn | High | None | Low | Project builds; landing page visible. |
| Supabase | Database Schema & RLS | High | Project Init | Medium | Migrations run; RLS blocks unauthorized access. |
| Auth | Login/Signup Flow | High | Supabase | Medium | Users can create accounts and stay logged in. |

## Epic 2: Settings & Security (Day 3)
| Feature | Task | Priority | Dependency | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|
| Encryption | Crypto Utility | High | None | Medium | Plaintext keys can be encrypted/decrypted reliably. |
| Settings | API Key Forms | High | Auth, Encryption | Medium | User can save keys; keys are stored encrypted. |
| Profile | Brand Profile UI | Medium | Auth | Low | Brand tone and personality are saved to DB. |

## Epic 3: AI Generation (Day 4)
| Feature | Task | Priority | Dependency | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|
| OpenAI Lib | Client & Prompt Wrapper | High | Settings | Medium | Service successfully calls OpenAI with test prompt. |
| UI | Generation Form | High | Profile | Medium | User can input topic and select count (5/10). |
| Backend | Generation Action | High | UI, OpenAI Lib | High | Posts are generated and saved to DB in draft state. |

## Epic 4: Workflow & Publishing (Day 5-6)
| Feature | Task | Priority | Dependency | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|
| Preview | Post List/Grid UI | High | Backend Gen | Medium | User can see all generated posts for a topic. |
| Edit | Inline Post Editing | Medium | Preview | Medium | User can modify text; changes persist to DB. |
| Buffer | Publishing Integration | High | Settings, Preview | High | "Publish" button sends post to Buffer queue successfully. |

## Epic 5: QA & Delivery (Day 7-8)
| Feature | Task | Priority | Dependency | Complexity | Acceptance Criteria |
|---|---|---|---|---|---|
| Testing | End-to-End Walkthrough | High | All Epics | Medium | No errors from Signup -> Generate -> Publish. |
| Docs | README & Agent Reports | Medium | All Epics | Low | Final documentation is complete and accurate. |
