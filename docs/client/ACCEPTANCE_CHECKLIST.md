# Acceptance Checklist — AI Content Publisher

**Version:** 1.3  
**Date:** 2026-06-04  
**Client:** ___________________________

---

## Instructions

Review each item below. Check the box if the feature works as described. Leave a note for any item that does not meet expectations.

---

## 1. System Access

- [ ] **Login works**
  - URL https://ai-content-publisher-saas.vercel.app loads in browser
  - Dashboard displays without errors
  - Navigation sidebar shows all pages
  - TH/EN language toggle switches labels

**Notes:** ___________________________

---

## 2. Brand Profile

- [ ] **Brand profile saved correctly**
  - Navigate to Brand Voice & Identity
  - Enter brand name, business type, audience, tone, personality
  - Click Save
  - Success toast appears
  - Reload page → data persists

**Notes:** ___________________________

---

## 3. Template Selector

- [ ] **Template selector works**
  - Brand Profile shows Template Theme selector
  - Can select "Legal Professional"
  - Active Template card updates with description and color swatches
  - Can select "Accounting Professional"
  - Active Template card updates accordingly
  - Selection persists after save and reload

**Notes:** ___________________________

---

## 4. Content Generation

- [ ] **Content generation works**
  - Navigate to Content Studio
  - Form loads in Quick Mode (not Advanced)
  - Template badge shows active theme
  - Select topic and set post count to 1
  - Click GENERATE CONTENT
  - Loading spinner appears
  - Posts generated successfully
  - Redirected to Review Board

**Notes:** ___________________________

---

## 5. Image Generation

- [ ] **Image generation works**
  - Approve a draft (อนุมัติ)
  - Click Generate Image
  - Select 1 image option
  - Image generated and composited
  - Image shows branded text overlay (title, body, CTA, brand name)
  - Image uses correct template colors (Legal = gold/navy, Accounting = green/white)

**Notes:** ___________________________

---

## 6. Draft Review

- [ ] **Draft review works**
  - Drafts list shows generated posts
  - Can click to expand/edit a draft
  - Can edit title, caption, hashtags
  - Can approve (อนุมัติ) a draft
  - Can reject (ปฏิเสธ) a draft
  - Filters work (by topic, platform, language, status)
  - Empty states show guidance when no posts exist

**Notes:** ___________________________

---

## 7. Publishing

- [ ] **Publishing works**
  - Post in "Creative Approved" status
  - Click Publish
  - Post sent to Buffer
  - Confirmation message appears
  - Post moves to "Published" column
  - Buffer dashboard shows the scheduled post

**Notes:** ___________________________

---

## 8. Error Handling

- [ ] **Error messages are clear**
  - Remove OpenAI key → try to generate → see error message directing to Settings
  - Remove Buffer key → try to publish → see error message directing to Settings
  - Try with only 1 topic and 10 posts → system works (no errors)
  - Try publishing from wrong status → appropriate error shown

**Notes:** ___________________________

---

## 9. Cost Understanding

- [ ] **Client understands monthly costs**
  - Client has read MONTHLY_COST_GUIDE.md
  - Client understands BYOK model
  - Client knows OpenAI is paid directly
  - Client knows Buffer is paid directly
  - Client accepts that API costs are their responsibility

**Signed:** ___________________________

---

## 10. Support Scope

- [ ] **Client accepts support scope**
  - Client has read SUPPORT_SCOPE.md
  - Client understands what is included
  - Client understands what is not included
  - Client agrees to support period (30 days)
  - Client has selected support tier (Basic / Standard / Premium / None)

**Signed:** ___________________________

---

## 11. Known Limitations

- [ ] **Client acknowledges known limitations**
  - Client has read KNOWN_LIMITATIONS.md
  - Client understands single-owner mode
  - Client understands content needs human review
  - Client accepts responsibility for published content
  - Client understands third-party API dependency
  - Client understands Facebook-only publishing

**Signed:** ___________________________

---

## 12. Final Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Client** | | | |
| **Developer** | | | |

---

## Summary

| Section | Items | Passed | Notes |
|---------|-------|--------|-------|
| System Access | 4 | ☐/4 | |
| Brand Profile | 5 | ☐/5 | |
| Template Selector | 5 | ☐/5 | |
| Content Generation | 7 | ☐/7 | |
| Image Generation | 6 | ☐/6 | |
| Draft Review | 6 | ☐/6 | |
| Publishing | 5 | ☐/5 | |
| Error Handling | 4 | ☐/4 | |
| Cost Understanding | 5 | ☐/5 | |
| Support Scope | 5 | ☐/5 | |
| Known Limitations | 6 | ☐/6 | |
| **Total** | **58** | **☐/58** | |

All items must pass for final acceptance. For any failed items, contact support@example.com to schedule a resolution before signing off.