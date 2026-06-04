# Monthly Cost Guide — AI Content Publisher

**Version:** 1.3  
**Date:** 2026-06-04

---

## Understanding BYOK (Bring Your Own Key)

The AI Content Publisher uses a **Bring Your Own Key (BYOK)** model. This means:

- **You** pay OpenAI and Buffer directly for their services
- **We** provide the platform that connects them
- Your API keys are encrypted and stored securely — we never see your raw keys
- You have full control over your accounts and billing

This model is more transparent and cost-effective than a bundled subscription.

---

## OpenAI Costs

OpenAI powers both **text generation** (GPT-4o) and **image generation** (gpt-image-2).

### Text Generation (GPT-4o)

| Metric | Cost |
|--------|------|
| Input tokens | ~$2.50 / 1M tokens |
| Output tokens | ~$10.00 / 1M tokens |
| Average post | ~500–1,000 tokens total |
| Average generation (5 posts) | ~3,000–5,000 tokens |

### Image Generation (gpt-image-2)

| Metric | Cost |
|--------|------|
| Per image (low quality, 1536×1024) | ~$0.04–$0.10 |
| Per image (standard) | Varies by model pricing |

### Example Monthly Scenarios

#### Scenario A: Light Usage (1–2 posts/week)
| Item | Quantity | Estimated Cost |
|------|----------|---------------|
| Text generations | 8 generations × 5 posts | ~$0.20–$0.50 |
| Image generations | 8 images | ~$0.32–$0.80 |
| **Total OpenAI** | | **~$0.50–$1.30 / month** |
| **In Thai Baht** | | **~฿20–฿50 / month** |

#### Scenario B: Moderate Usage (3–5 posts/week)
| Item | Quantity | Estimated Cost |
|------|----------|---------------|
| Text generations | 16 generations × 5 posts | ~$0.40–$1.00 |
| Image generations | 16 images | ~$0.64–$1.60 |
| **Total OpenAI** | | **~$1.00–$2.60 / month** |
| **In Thai Baht** | | **~฿35–฿95 / month** |

#### Scenario C: Heavy Usage (10+ posts/week)
| Item | Quantity | Estimated Cost |
|------|----------|---------------|
| Text generations | 40 generations × 5 posts | ~$1.00–$2.50 |
| Image generations | 40 images | ~$1.60–$4.00 |
| **Total OpenAI** | | **~$2.60–$6.50 / month** |
| **In Thai Baht** | | **~฿95–฿240 / month** |

> 💡 Actual costs depend on OpenAI's current pricing. Check https://openai.com/pricing for the latest rates.

---

## Buffer Costs

| Plan | Cost | Details |
|------|------|---------|
| **Free** | $0/month | 1 channel, 10 queued posts at a time |
| **Essentials** | $6/month | 1 channel, unlimited queued posts, analytics |

For most single-law-firm or single-accounting-firm use cases, the **Free plan** is sufficient. Upgrade if you need more than 10 posts in your queue at once.

---

## Infrastructure Costs (Covered by Provider)

| Service | Cost to You | Notes |
|---------|-------------|-------|
| Supabase (database + storage) | **฿0** | Covered by provider (free tier) |
| Vercel (hosting) | **฿0** | Covered by provider (free tier) |
| Domain | **฿0** | Covered by provider |

> 💡 No hidden infrastructure costs. You only pay for what you use (OpenAI + Buffer).

---

## Summary Table

| Service | Who Pays | Estimated Monthly Cost |
|---------|----------|----------------------|
| **OpenAI** (text + images) | **You** | ฿20–฿240 (varies by usage) |
| **Buffer** (publishing) | **You** | ฿0–฿220 (Free or Essentials) |
| **Supabase** (database) | **Provider** | ฿0 |
| **Vercel** (hosting) | **Provider** | ฿0 |
| **Monthly support** (optional) | **You** | ฿1,500–฿6,000 (optional) |
| **Total (without support)** | | **฿20–฿460 / month** |
| **Total (with Basic support)** | | **฿1,520–฿1,960 / month** |

---

## Cost Control Tips

1. **Set a monthly budget** on your OpenAI account (platform.openai.com/account/billing)
2. **Use Low Quality** for images (default) — good enough for social media
3. **Generate 5 posts at a time** instead of 10 to reduce token usage
4. **Reuse and edit** generated content rather than regenerating from scratch
5. **Monitor usage** in your OpenAI dashboard under Usage

---

## OpenAI Budget Alerts

We recommend setting up a monthly budget alert in OpenAI:

1. Go to https://platform.openai.com/account/billing
2. Click **Usage limits**
3. Set a **Monthly budget** of $5–$10 (adjust as needed)
4. You'll receive an email when you reach 50%, 80%, and 100% of your budget

This prevents surprise bills and gives you full control.

---

## FAQ

**Q: Why does the client pay for OpenAI directly?**
A: This is a Bring Your Own Key (BYOK) model. You have full control over your API usage and billing. We don't mark up API costs.

**Q: What if I don't use it one month?**
A: You pay nothing for OpenAI if you don't generate anything. Buffer free tier costs nothing. You only pay for what you use.

**Q: Can I set a hard spending limit?**
A: Yes, on your OpenAI dashboard under Billing → Usage limits. Set a hard cap.

**Q: Is there a monthly subscription for the platform itself?**
A: Currently, the platform is provided as part of the setup package. A monthly SaaS subscription may be introduced in future versions.