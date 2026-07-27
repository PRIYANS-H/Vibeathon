# ⚡ AuraResto OS — Smart Operationally Intelligent Restaurant OS
### VibeAthon 6.0 (2K26) — Platinum Build Submission

[![Tier](https://img.shields.io/badge/VibeAthon_6.0-Platinum_Tier_100%25-7c3aed?style=for-the-badge&logo=rocket)](https://github.com)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind_v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Gemini](https://img.shields.io/badge/AI-Gemini_1.5_Flash-4285f4?style=for-the-badge&logo=google)](https://ai.google.dev)

> *"Every other team digitized the paperwork. We digitized the decisions."*

---

## 🏆 Submission Summary Checklist

- [x] **Team Name**: Antigravity Innovators
- [x] **Tech Stack**: React + Vite + Tailwind CSS + Lucide Icons + Recharts + FastAPI (Python) + Supabase PostgreSQL (Realtime & Auth) + Gemini API
- [x] **User Stories Completed**: Full coverage from **Bronze → Silver → Gold → Platinum + Bonus**
- [x] **AI Usage Disclosure**:
  - **Gemini API & Function Calling Agent**: AI Captain for conversational ordering, diet filtering, stock checks & order placement.
  - **Prep-Time Prediction**: Weighted backlog heuristic prep engine (upgradable to LightGBM regression).
  - **AI Assistance**: UI layout architecture, glassmorphism design system, and API contract design.
- [x] **GitHub Repository**: Public codebase with modular structure and clean commit history.

---

## 🗺️ Completed Scope Map

| Tier | User Story | Features Delivered | Status |
|---|---|---|---|
| **Bronze** | US1 | Modern responsive glassmorphic UI for customer, kitchen, floor staff, & admin with live visual feedback | ✅ Completed |
| **Silver** | US2 | Email/Password + OTP auth, Google OAuth 2.0 simulation, Role-based access control (Customer / Staff / Kitchen / Admin) | ✅ Completed |
| **Silver** | US3 | Digital menu, live stock availability, table reservations, cart order placement, queue management, billing, notifications | ✅ Completed |
| **Gold** | US4 | Full Admin & Operations Dashboard: Hourly sales telemetry, Peak demand hours, Top dishes, Inventory thresholds, Staff roster, Customer feedback | ✅ Completed |
| **Platinum** | US5 | **Auto-Availability Engine** (dishes auto-grey out when stock drops below threshold), **Live SLA Load-Balancing Kitchen View**, **AI Captain Conversational Ordering Agent**, **Live Wait-Time ETA Prediction Engine** | ✅ Completed |
| **Bonus** | — | Real-time WebSocket sync across all viewports, Checkout upsell recommender, Post-meal 5-star rating & feedback loop | ✅ Completed |

---

## 🔥 Key Differentiator Features

### 1. Auto-Availability Engine
Dishes are **never manually toggled unavailable**. Each dish is linked to ingredient recipes with stock thresholds. When stock drops below required levels (e.g. Truffle Oil drops below 15ml), the dish automatically greys out across all customer screens in real-time with an explicit shortage badge. Dragging the admin inventory slider re-enables dishes instantly!

### 2. Kitchen SLA Load-Balancing View
Kitchen staff view orders sorted by SLA breach proximity. Orders decay visually from **Green (<55% elapsed)** to **Amber (Priority)** to **Red/Pulsing (Near SLA Breach)**. Includes station load capacity meters for Grill, Curry, Biryani, and Cold Prep.

### 3. AI Captain (Conversational Ordering Agent)
Gemini-powered natural language assistant. Customers can ask natural questions ("What's spicy and under ₹200 that's available right now?"), check live order ETA, or tell it to add items directly to their cart.

### 4. Live Wait-Time / ETA Engine
Computes ETA dynamically based on item prep times + active kitchen backlog orders. Recalculated live as tickets move through `Placed` → `In Kitchen` → `Ready` → `Served`.

---

## 🏗️ Technical Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌───────────────────┐
│   Customer Web   │      │   Staff/Kitchen   │      │   Admin Dashboard  │
│  (React + Vite)  │      │  (React + Vite)   │      │   (React + Vite)   │
└────────┬─────────┘      └─────────┬─────────┘      └─────────┬─────────┘
         │                          │                          │
         └──────────────┬───────────┴──────────────┬───────────┘
                         │  REST + WebSocket
                 ┌───────▼────────────────────────▼────────┐
                 │           FastAPI Backend                │
                 │  - Auth (Supabase Auth & RBAC)           │
                 │  - Orders / Menu / Inventory / Tables    │
                 │  - Availability Engine (triggers)        │
                 │  - ETA / Prediction Service              │
                 │  - AI Captain (Gemini function-calling)  │
                 └───────────────────┬───────────────────────┘
                                     │
                       ┌─────────────▼─────────────┐
                       │   Supabase (Postgres)      │
                       │  - Auth (Email/OTP+OAuth)  │
                       │  - Realtime channels        │
                       │  - Row-level security       │
                       └─────────────────────────────┘
```

---

## ⚡ Quick Start & Running Locally

### 1. Frontend Web App
```bash
# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```

### 2. FastAPI Backend Server (Optional)
```bash
cd backend
pip install fastapi uvicorn pydantic google-generativeai
python main.py
```
Backend server will run at `http://localhost:8000`.

---

## 🎬 3-Minute Hackathon Presentation / Demo Script

1. **Role Switcher Header (0:00 - 0:35)**:
   - Click between `Customer View`, `Kitchen SLA`, `Floor Staff`, and `Admin Ops` using the top navigation bar.
2. **Auto-Availability Live Engine (0:35 - 1:15)**:
   - Switch to **Admin Ops** -> **Auto-Availability Engine** tab.
   - Drag the **Truffle Oil** or **Avocado** slider to `0`.
   - Switch back to **Customer View** — witness the *Royal Truffle Mushroom Burger* automatically grey out with an explicit low-stock badge!
3. **AI Captain Ordering Agent (1:15 - 1:55)**:
   - Click **Ask AI Captain** in the header.
   - Type *"What is spicy and available?"* or click *"Add Butter Chicken to cart"*.
   - Watch the agent query live menu stock and insert the dish directly into your cart!
4. **Kitchen SLA & Real-time Order Flow (1:55 - 2:30)**:
   - Place an order for Table 3.
   - Switch to **Kitchen SLA** view — notice the SLA countdown timer and color-coded SLA decay progress bar!
   - Click **Start Cooking** -> **Mark Ready** -> **Mark Served**.
5. **Analytics & Realtime Broadcast (2:30 - 3:00)**:
   - Open the **Supabase Realtime Stream** (radio icon) in the header to view instant WebSocket telemetry logs.
   - Walk through the Recharts hourly sales and top dish breakdown in **Admin Ops**.
