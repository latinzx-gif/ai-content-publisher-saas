# Known Limitations — AI Content Publisher

**Version:** 1.3  
**Date:** 2026-06-04

This document lists all known limitations of the current version. Please read carefully before accepting handoff.

---

## 1. Not a Full Self-Service SaaS

- The system runs in **single-owner mode** — there is no multi-user login or team access
- Only **one user** can access the system at a time
- There is no registration or sign-up page
- New clients require a separate instance or manual configuration
- **Impact:** You cannot add team members or clients independently

---

## 2. Requires Client API Keys (BYOK)

- The system uses a **Bring Your Own Key (BYOK)** model
- You must provide your own **OpenAI API key** and **Buffer access token**
- If your OpenAI key expires or runs out of quota, **content generation stops** until you resolve it
- If your Buffer token expires, **publishing stops** until you update it
- **Impact:** Service continuity depends on your API key management

---

## 3. Requires Buffer Setup

- Publishing is handled through **Buffer** — not directly from the app
- You need a **Buffer account** and a **Facebook Page** connected to it
- Publishing is limited to **one Facebook Page** currently
- Buffer's free plan limits you to **10 queued posts at a time**
- **Impact:** Publishing is not truly "one-click" — Buffer sits between the app and Facebook

---

## 4. Legal / Accounting Content Needs Human Review

- AI-generated content is a **draft**, not a final product
- Legal content (PDPA, labour law, contracts) **must be reviewed** by a qualified lawyer before publishing
- Accounting/tax content **must be reviewed** by a qualified accountant
- **We do not guarantee** the accuracy, completeness, or legal validity of any generated content
- **Impact:** You must allocate human review time for every post before publishing

---

## 5. No Guarantee of Legal Advice Accuracy

- The AI is a **language model**, not a lawyer or accountant
- It may generate:
  - Outdated legal references
  - Incorrect tax calculations
  - Missing disclaimers
  - Jurisdiction-inappropriate advice
- You are **solely responsible** for verifying all content
- **Impact:** Incorrect content published to your Facebook Page could have legal or reputational consequences

---

## 6. Publishing Depends on Third-Party API Status

| Service | Dependency | Risk |
|---------|------------|------|
| OpenAI | GPT-4o + gpt-image-2 | API outages, rate limits, price changes |
| Buffer | Publishing queue | API changes, service outages |
| Facebook | Buffer → Facebook | Page policy changes, API restrictions |
| Supabase | Database + storage | Service degradation |
| Vercel | Hosting | Platform outages |

- **Impact:** Publishing failures can occur if any of these services are down, regardless of the application's health
- **We do not control** third-party service uptime

---

## 7. Limited Platform Support

- Publishing currently supports **Facebook only** via Buffer
- Instagram, LinkedIn, Twitter, and other platforms are **not yet supported**
- Platform selection in the generator is for **content format only** — not actual multi-platform publishing
- **Impact:** You cannot publish to Instagram or LinkedIn from this system

---

## 8. No Analytics or Reporting

- The system does **not track** post performance, engagement, or reach
- There is **no analytics dashboard**
- Publishing history is available in your Buffer dashboard
- **Impact:** You need to use Buffer's analytics or a separate tool to measure post performance

---

## 9. No Scheduling Calendar

- There is **no visual scheduling calendar** in the current version
- Posts are sent to Buffer's queue, and Buffer handles scheduling
- You must use Buffer's dashboard to set specific publish times
- **Impact:** You need to switch to Buffer to manage posting schedules

---

## 10. Limited Content Templates

- Only **two templates** are available: Legal Professional and Accounting Professional
- Custom templates are **not supported** (available as paid add-on)
- Content prompt templates are currently **static and hardcoded**
- **Impact:** If neither template fits your brand, you may need custom work

---

## 11. Image Generation Latency

- gpt-image-2 takes **20–45 seconds** per image
- Multiple image options multiply this time (e.g., 3 options = 60–135 seconds)
- Sharp compositing adds ~1–3 seconds per image
- **Impact:** Image generation is not instant; plan for 30–60 second waits

---

## 12. No Mobile App

- The system is a **web application** designed for desktop browsers
- It works on mobile browsers but is **not optimized** for small screens
- There is no iOS or Android app
- **Impact:** Full functionality requires a desktop or laptop computer

---

## Summary

| Limitation | Severity | Workaround |
|------------|----------|------------|
| Single-owner mode | Medium | Request separate instance for each user |
| BYOK API keys | Medium | Monitor key expiry and billing |
| Buffer dependency | Medium | Set up Buffer + Facebook Page beforehand |
| Content needs human review | **Critical** | Always review before publishing |
| No legal accuracy guarantee | **Critical** | Verify with qualified professional |
| Third-party API dependency | Medium | Monitor OpenAI/Buffer status pages |
| Facebook only | Medium | Use Buffer for now |
| No analytics | Low | Use Buffer analytics |
| No scheduling UI | Low | Use Buffer's queue scheduling |
| Limited templates | Low | Custom templates available as add-on |
| Image latency | Low | Plan ahead — generate images in batches |
| No mobile app | Low | Use on desktop/laptop |

---

## Your Responsibility

By accepting this system, you acknowledge:

1. You will **review all content** before publishing
2. You take **full responsibility** for published content
3. You will **verify legal/accounting accuracy** with qualified professionals
4. You will **manage your API keys** (OpenAI, Buffer)
5. You understand that **third-party service outages** may affect publishing
6. You have read and accept the **Support Scope** (SUPPORT_SCOPE.md)