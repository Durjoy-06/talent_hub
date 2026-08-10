# Talent Hub

> A modern Talent Ecosystem dashboard built with React, Vite, Express, Supabase, and Google Gemini AI.

Talent Hub helps students, organizers, and hiring teams collaborate through regional talent clusters, verified showcases, AI-assisted chat, and opportunity discovery.

---

## 🚀 Features

- React + Vite frontend with polished dashboard components
- Express backend that proxies AI chat using Google Gemini
- Supabase integration for data access and authentication
- Tailwind CSS styling and motion-driven UI
- Student, organizer, and network views with dynamic interactions

---

## ▶️ Quick Start

```bash
npm install
npm run dev

Open `http://localhost:3000`

---

## ⚙️ Environment Variables

Add a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
```

---

## 📦 Scripts

- `npm run dev` — start development server
- `npm run build` — build frontend and bundle server
- `npm run start` — run production build
- `npm run preview` — preview built app
- `npm run lint` — type-check TypeScript

---

## 📁 Important files

- `server.ts` — Express app and Gemini AI proxy
- `src/App.tsx` — main React app
- `src/components/` — dashboard and UI components
- `src/lib/supabase.ts` — Supabase client setup
- `src/lib/connectionTest.ts` — connection test helper

---

## 💡 Notes

- Uses `tsx` for TypeScript server development
- Loads `.env.local` first, then `.env`
- Gemini AI falls back to a simulated response mode if the API key is not configured

---
```
