# ⚡ AuraResto OS — Operationally Intelligent Restaurant OS
### VibeAthon 6.0 (2K26) — Platinum Build Submission

[![Tier](https://img.shields.io/badge/VibeAthon_6.0-Platinum_Tier_100%25-7c3aed?style=for-the-badge&logo=rocket)](https://github.com/PRIYANS-H/Vibeathon)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Styling-Tailwind_v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_Python-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Gemini](https://img.shields.io/badge/AI-Gemini_1.5_Flash-4285f4?style=for-the-badge&logo=google)](https://ai.google.dev)

> **Core Problem Solved:** *"We reduce customer waiting time and food wastage through AI-assisted restaurant operations."*

---

## 🏆 Operational Story & Pitch

Instead of building a static menu and billing clone, **AuraResto OS** digitizes the real-time decisions restaurants make manually:

```
Customer Scan QR / Book Table
       ↓
Digital Menu (Auto-Availability Check)
       ↓
Order Placed & Live Heuristic ETA Calculated
       ↓
Kitchen Display System (4-Stage SLA Kanban Board)
       ↓
Chef Prepares & Marks Ready (Customer Pickup Alert)
       ↓
Floor Staff Delivers & Billing Tax Invoice Generated
       ↓
Feedback Collected & Operations Telemetry Updated
```

---

## 🗺️ Completed Feature Scope Map

| Tier | User Story | Operational Feature Delivered | Status |
|---|---|---|---|
| **Bronze** | US1 | Responsive glassmorphic UI across Customer, Kitchen, Floor Staff, & Admin viewports | ✅ Completed |
| **Silver** | US2 | Email/Password + OTP, Google OAuth simulation, Role-based Access Control (RBAC) | ✅ Completed |
| **Silver** | US3 | Table QR Code scanner, Live Stock Auto-Availability, Table Reservations, Cart Billing | ✅ Completed |
| **Gold** | US4 | **Admin & Operations Suite**: Hourly sales telemetry, Demand forecasting, Wastage prevention | ✅ Completed |
| **Platinum** | US5 | **Auto-Availability Engine** (dishes auto-disable on ingredient shortage), **Kitchen SLA Kanban Board**, **AI Manager & Kitchen Copilot**, **Live Wait-Time ETA Prediction Service** | ✅ Completed |
| **Bonus** | — | **Command Palette (`Ctrl + K`)**, Supabase Realtime WebSocket broadcast, Automated 10s Judge Demo Runner | ✅ Completed |

---

## 🔥 Key Operational Differentiators

### 1. Auto-Availability Engine (Waste & Shortage Prevention)
Dishes are **never manually toggled unavailable**. Each dish is linked to ingredient stock levels. When stock drops below safety thresholds (e.g. Truffle Oil drops to 0ml), the dish automatically turns sold-out across all customer screens in real-time with an explicit shortage badge.

### 2. Kitchen Display System (4-Stage SLA Kanban Board)
Orders flow through a 4-column Kanban board: `Pending (Placed)` ➔ `Cooking (In Kitchen)` ➔ `Ready (Pickup)` ➔ `Delivered / Closed`. Cards decay dynamically from **Green (On Time)** to **Amber (Priority)** to **Red (SLA Breach Threat)** with station load indicators.

### 3. AI Manager & Kitchen Copilot
Powered by Gemini API with structured operational query capabilities:
- *"Which dishes are slowing kitchen operations?"* (Returns prep bottleneck analysis)
- *"What inventory should I reorder?"* (Reorder advice to prevent stockouts)
- *"Which waiter is busiest?"* (Staff workload telemetry)
- *"Suggest waste prevention promotion"* (Combo recommendations for high-stock items)

### 4. Demand & Waste Forecasting
Rule-based predictive analysis based on order velocity:
- Tomorrow's Expected Footfall (e.g. 182 customers)
- Forecasted Revenue (₹62,000)
- Inventory Reorder & Food Wastage Warnings

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
Backend server runs at `http://localhost:8000`.

---

## 🎬 1-Click Hackathon Judge Demo

1. Click **`▶ Run Demo`** in the top navigation header.
2. Watch the automated 10-second walkthrough execute:
   - Depletes Truffle Oil stock ➔ Truffle Burger turns SOLD OUT
   - Adds Butter Chicken to cart ➔ Places order with Heuristic ETA
   - Switches to Kitchen SLA ➔ Escalates ticket ➔ Fires celebration confetti!
