# Orela Dental — clinic website and front-desk automation (demo)

A portfolio demo of a dental clinic website for two markets, with online booking, a same-day emergency queue, a WhatsApp/SMS-style chat and an AI front desk.

**Live demo:** https://orela-dental-demo.netlify.app

> Orela Dental is fictional. The site is modelled on real dental clinic websites, but the clinic, people, addresses and phone numbers are made up, and all images and videos are AI-generated. Forms never send anything, and the site is set to `noindex`.

## Two markets, one codebase

| | EU version (Barcelona, Spain) | US version (Houston, Texas) |
|---|---|---|
| Languages | Spanish, Catalan, English (British), French | English (American), Spanish |
| Prices | Starting prices shown up front, written quote after the first visit | Insurance-first: PPO coverage, payment plans |
| Messaging | WhatsApp | SMS |
| Formats | 24-hour clock, day/month dates, € | 12-hour clock, month/day dates, $ |
| Legal pages | Privacy, cookies (with a sample consent banner) | Privacy, language assistance |

Every page has its own URL in every language (for example `/es/ca/treatments/` or `/us/es/emergency/`).

## What to try

1. **Live opening status** at the top of every page, worked out in the clinic's own time zone ("Open now", "Closes in 45 min").
2. **Pick a free time** on the home page and go through the three-step booking. At the end, a panel shows the data that would be sent to a booking system or CRM.
3. **Same-day emergency queue**: take a number and see how many people are ahead of you.
4. **Front-desk assistant** (chat button): ask about hours or prices, then ask something unusual, then mention a symptom.
5. **WhatsApp / SMS simulator** (green button): book through list messages and reply buttons, within WhatsApp's real limits (3 buttons, 20 characters; 10 list rows, 24 characters).
6. **Style switcher** in the dark demo bar: three visual styles share one layout.

The feature demos (missed-call follow-up, waiting-list auto-fill, front-desk dashboard, integration overview) are linked from the demo bar.

## The AI front desk, and how it is kept safe

Messages go to a small serverless function (`/api/receptionist`):

- **Rules first.** Common questions (hours, prices, insurance, directions, languages) get fixed answers built from the clinic's data, so figures are always exact.
- **Symptoms, urgent requests and changes never reach the AI.** Symptoms are sent to the phone (or the emergency number for severe cases); changes and cancellations go to a person.
- **AI only for the rest.** Questions the rules don't cover go to Llama 3.1 8B on Cloudflare Workers AI. The model gets the clinic's information from the CMS and is told to answer only from it, or to hand over.
- **No made-up numbers.** If a reply contains any number that is not in the clinic's information (a price, a time, a phone number), it is discarded and the message goes to a person.
- **Fails safe.** If the AI is unavailable or the free daily allowance runs out, the assistant falls back to the rules. Replies written by the AI carry an "AI" tag.
- **No storage.** Messages are not stored or logged by the site.

## How it is built

- **Next.js 16 (App Router) and TypeScript**, exported as static pages and hosted on Netlify.
- **Headless CMS (Sanity):** treatments, team, FAQ, opening hours and trust numbers are edited in four languages and read at build time from Sanity's public, read-only API. No write key is stored in the site. If the CMS can't be reached, the build falls back to local sample data and warns.
- **One module for the clinic logic** (`src/lib/clinic/`): opening status across time zones and daylight saving time, free slots, the emergency queue, waiting-list matching, assistant routing, the booking payload, the chat flow, formatting per market and dashboard numbers.
- **Automated tests** (Vitest) for that module, the CMS mapping and the AI guard rails: 62 tests.
- **Privacy by default:** fonts are served from the site, there are no analytics or tracking pixels, and the site sets no cookies. The embedded Google map on the contact page is the one exception, and the privacy and cookie pages say so.
- **Accessibility:** keyboard-operable menus, reduced-motion support (the hero video stays paused), and text and button colours that meet WCAG AA contrast (4.5:1) in all three styles.

## Project structure

```
src/
  app/(clinic)/[region]/[lang]/   clinic site pages (EU and US, every language)
  app/(showcase)/                 portfolio pages and feature demos
  components/                     UI components
  lib/clinic/                     clinic logic, AI guard rails, and their tests
  content/                        content model, CMS mapping, local sample data
  i18n/                           interface text in en, es, ca, fr
netlify/functions/receptionist.mts  serverless API for the front desk
scripts/                          build-time content fetch and AI facts
studio/                           Sanity Studio (CMS schema and seed data)
```

## Running it locally

Requires Node.js 20.

```bash
npm install
npm test          # run the tests
npm run build     # fetch content, build the static site into out/
npm start         # serve out/ locally
```

Without the Cloudflare variables below, the front desk answers with the rules only.

### Environment variables (Netlify)

| Name | Purpose |
|---|---|
| `CF_ACCOUNT_ID` | Cloudflare account ID |
| `CF_AI_TOKEN` | API token limited to Workers AI |

See `.env.example`.

## Author

Built by Masa — web developer in Barcelona, working in English, Spanish and Japanese (conversational German).
