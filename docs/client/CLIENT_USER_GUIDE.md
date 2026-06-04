# Client User Guide — AI Content Publisher

**Version:** 1.3  
**Date:** 2026-06-04  
**URL:** https://ai-content-publisher-saas.vercel.app

---

## Table of Contents

1. [Login](#1-login)
2. [Set Brand Profile](#2-set-brand-profile)
3. [Choose Legal or Accounting Template](#3-choose-legal-or-accounting-template)
4. [Configure OpenAI Key](#4-configure-openai-key)
5. [Configure Buffer](#5-configure-buffer)
6. [Generate Content](#6-generate-content)
7. [Generate Image](#7-generate-image)
8. [Review Draft](#8-review-draft)
9. [Approve Creative](#9-approve-creative)
10. [Publish or Schedule](#10-publish-or-schedule)
11. [Common Errors and Fixes](#11-common-errors-and-fixes)

---

## 1. Login

1. Open your browser and go to: `https://ai-content-publisher-saas.vercel.app`
2. The dashboard will load automatically (single-owner mode — no login screen)
3. You will see the **Dashboard** showing your content overview

> ⚠️ If you see existing test data, the instance has not been reset. Contact support.

---

## 2. Set Brand Profile

1. Click **น้ำเสียงและตัวตนแบรนด์** (Brand Voice & Identity) in the left sidebar
2. Fill in the following fields:

| Field | What to Enter | Required |
|-------|---------------|----------|
| ชื่อธุรกิจ / ชื่อแบรนด์ | Your firm name | ✅ |
| ประเภทธุรกิจ | Legal Advisory, Accounting Firm, etc. | ✅ |
| กลุ่มเป้าหมายหลัก | Who you want to reach | ✅ |
| โทนภาษาหลัก | Professional, Friendly, etc. | ✅ |
| บุคลิกภาพของแบรนด์ | Trustworthy, Modern, etc. | ✅ |
| Brand Description | What your firm does, positioning, differentiators | Optional |
| Brand Instructions | Standing instructions for content generation | Optional |
| Content Rules | Disclaimers, required wording, compliance notes | Optional |
| Image Rules | Preferred visual styles, brand colors | Optional |
| Template Theme | Legal Professional or Accounting Professional | ✅ |

3. Click **บันทึกการเปลี่ยนแปลง** (Save Changes)
4. You should see a success toast: "บันทึกสำเร็จ"

---

## 3. Choose Legal or Accounting Template

1. In the Brand Profile form, scroll to **Template Theme (โทนภาพ)** section
2. Select your template:

| Template | Best For | Colors | Fonts |
|----------|----------|--------|-------|
| **Legal Professional** | Law firms, legal advisors | Gold + Navy, Serif | Serif |
| **Accounting Professional** | Accounting firms, tax advisors | Green + White, Sans-serif | Clean sans-serif |

> 💡 The **Visual Template** affects image colors, fonts, and CTA button style only. It is separate from **Content Presets** (topic suggestions like "PDPA Compliance Tips") which are topic shortcuts in the Content Generator. Switching the visual template does not change available topic presets.

3. The **Active Template** card below the selector shows the template name, description, and color swatches
4. Click Save

---

## 4. Configure OpenAI Key

1. Click **ช่องทางเผยแพร่และ API** (Settings) in the left sidebar
2. In the **OpenAI API Key** section, paste your API key
3. Click **Save**
4. The system will test the connection automatically
5. You should see "Connection successful" or a green status badge

> 💡 Your API key is encrypted (AES-256-GCM) and stored securely. It is never exposed to the browser.

---

## 5. Configure Buffer

1. In the same **Settings** page, scroll to **Buffer Access Token**
2. Paste your Buffer access token
3. Click **Save**
4. The system will test the connection and verify your Facebook channel
5. You should see "Connection successful" with your Facebook Page name

---

## 6. Generate Content

1. Click **สตูดิโอสร้างคอนเทนต์** (Content Studio) in the sidebar
2. Review your active brand and template in the top bar
3. The form defaults to **Quick Mode** — only essential fields are shown
4. Set the following:

| Field | What to Choose |
|-------|---------------|
| Topic | Select a topic or type a custom one |
| Language | TH (Thai) or EN (English) |
| Platform | Facebook |
| Format | Facebook Post (with image) or Text Only |
| Word count | 150, 300, 500, 800, or 1200 words |
| Number of posts | 1, 3, 5, or 10 |

5. For more control, switch to **Advanced** mode to set audience, tone, objective, format, and hashtags
6. Click **GENERATE CONTENT**

> ⏳ Generation takes 15–30 seconds. A spinner will show progress. Do not click again.

7. After completion, you'll see a success message and be redirected to the Draft Review page

---

## 7. Generate Image

1. After text generation, the post appears as a **Draft** in the Review Board
2. Click **อนุมัติ** (Approve) to move it to text approval
3. The post moves to the **Text Approved** column
4. Click the **Generate Image** button on the post card
5. Choose the number of image options (1, 2, or 3)
6. The system generates the image:
   - AI creates a background illustration (no text in the image)
   - Your brand title, body text, CTA, and brand name are overlaid programmatically
   - The result uses your selected template colors and fonts

> ⏳ Image generation takes 20–45 seconds

---

## 8. Review Draft

1. In the Review Board, click on any draft to expand it
2. You can:
   - **Edit** title, caption, and hashtags
   - **Approve** (อนุมัติ) to move to the next stage
   - **Reject** (ปฏิเสธ) to remove from the workflow
3. Drafts flow through columns:
   - **Drafts** → **Text Approved** → **Images Ready** → **Creative Approved** → **Published**

---

## 9. Approve Creative

1. After images are generated, the post moves to **Images Ready**
2. Click **Select** to choose your preferred image option
3. Review the selected image
4. Click **Approve Creative** (อนุมัติครีเอทีฟ)
5. The post moves to **Creative Approved** column

---

## 10. Publish or Schedule

1. From **Creative Approved** column, click **Publish**
2. The post is sent to your Buffer queue
3. Buffer schedules it according to your Buffer queue settings
4. After publishing, the post moves to **Published** column
5. You can view the Buffer post by clicking the external link

> 💡 Publishing requires a Facebook Page connected to Buffer. See CLIENT_SETUP_CHECKLIST.md.

---

## 11. Common Errors and Fixes

### "OpenAI API key is invalid"
- **Cause:** The API key is incorrect or expired
- **Fix:** Go to Settings → OpenAI section. Regenerate a new key at platform.openai.com and paste it

### "OpenAI account has exceeded its usage quota"
- **Cause:** Your OpenAI account billing limit has been reached
- **Fix:** Go to platform.openai.com/account/billing and add more credits

### "OpenAI rate limit reached"
- **Cause:** Too many requests in a short time
- **Fix:** Wait 30 seconds, then try again with fewer posts (3 instead of 10)

### "Request timed out"
- **Cause:** Content too long or OpenAI is slow
- **Fix:** Try generating fewer posts (3 instead of 10) or shorter word count (300 instead of 800)

### "Buffer is not connected"
- **Cause:** Buffer access token not configured
- **Fix:** Go to Settings → Buffer section and paste your Buffer access token

### "No Facebook channel found"
- **Cause:** Buffer account has no Facebook Page connected
- **Fix:** Connect a Facebook Page in Buffer dashboard (buffer.com)

### "Image generation failed"
- **Cause:** OpenAI image API error or storage issue
- **Fix:** Check OpenAI billing. If persistent, contact support.

### "Please configure your Brand Profile first"
- **Cause:** Brand name or business type is missing
- **Fix:** Go to Brand Profile page and complete all required fields

---

## Need Help?

For technical support, contact latinzx@gmail.com.