<div align="center">

<!-- Logo / Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=200&section=header&text=IGXSecure&fontSize=60&fontColor=ffffff&fontAlignY=38&desc=A%20Distraction-Free%2C%20Self-Hosted%20Instagram%20Interface&descAlignY=58&descColor=a8d8ea" width="100%"/>

<!-- Badges -->
<p>
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Meta%20Graph%20API-v21-0866FF?style=for-the-badge&logo=instagram&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square"/>
  <img src="https://img.shields.io/badge/Phase-5A%20Complete-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/Platform-Ubuntu%20Server-E95420?style=flat-square&logo=ubuntu&logoColor=white"/>
</p>

</div>

***

## 👋 About Me

Hi, I'm **Ravirajsinh Rathod** — an IT student and tech enthusiast based in **Ontario, Canada** 🇨🇦

I'm passionate about:
- 🖥️ **Server administration** — HP ProLiant hardware, Ubuntu, Nginx, systemd
- 🤖 **AI & automation** — building tools that remove friction from daily workflows
- 💰 **Financial literacy** — ETF investing via Wealthsimple
- 🔐 **Self-hosted privacy tools** — owning your data, your way

> *IGXSecure is my flagship personal project — built from scratch, deployed on my own hardware, and designed to prove that open tools can outperform big-tech interfaces.*

***

## 🔒 What is IGXSecure?

**IGXSecure** is a **secure, self-hosted Instagram interface** that gives you back control of your feed.

No ads. No algorithm. No Reels rabbit holes. Just the content you actually care about — served through the **official Meta Graph API**, running on **your own server**.

```
Your Browser
    ↓  HTTPS
Nginx Reverse Proxy
    ↓
IGXSecure Backend (Node.js + Express)
    ↓
Meta Graph API (Official)
    ↓
Your Instagram Data — securely
```

***

## ✨ Core Features

| Feature                                        | Status                    |
| ---------------------------------------------- | ------------------------- |
| 📰 Clean Instagram feed (no ads, no algorithm) | ✅ Live                    |
| 💬 Direct Messages viewer                      | ⏳ Pending Meta App Review |
| 📖 Stories viewer + Insights                   | ✅ Live                    |
| 🔔 Notifications (likes + comments)            | ✅ Live                    |
| 🔐 OAuth2 login via Meta                       | ✅ Live                    |
| 🛡️ Helmet.js security headers                 | ✅ Live                    |
| ⚡ Rate limiting (100 req/15min)                | ✅ Live                    |
| 🌐 CORS locked to frontend origin              | ✅ Live                    |
| 🔑 AES-256 token encryption                    | ✅ Live                    |
| 📱 PWA / Mobile-ready UI                       | 🔜 Phase 7                |

***

## 🏗️ Tech Stack

### Backend
```
Node.js v22       — Runtime
Express 4         — API framework
Helmet.js         — Security headers
express-rate-limit — Request throttling
CORS              — Origin restriction
pg / pg-pool      — PostgreSQL client
dotenvx           — Encrypted env vars
axios             — HTTP client for Meta API
```

### Infrastructure
```
Ubuntu Server     — Host OS
Nginx             — Reverse proxy + HTTPS
systemd           — Service management
PostgreSQL 17     — Database (Phase 4+)
```

### Meta Integration
```
Meta Graph API v21    — Official Instagram API
OAuth2 Authorization  — Secure login flow
Long-lived tokens     — 60-day session tokens
Permissions: instagram_basic, instagram_manage_messages
```

***

## 📁 Project Structure

```
IGXSecure/
├── backend/
│   ├── config/
│   │   └── security.js        # Helmet + rate limiting config
│   ├── db/
│   │   └── init.js            # PostgreSQL schema init
│   ├── routes/
│   │   ├── feed.js            # GET /igxsecure/api/feed ✅
│   │   └── system.js          # GET /igxsecure/api/system/health
│   ├── .env                   # 🔒 Never committed
│   ├── package.json
│   └── server.js              # Entry point
├── frontend/                  # Phase 6 — React UI
├── nginx/                     # Reverse proxy config
├── .gitignore
└── README.md
```

***

## 🚀 API Endpoints

```
Base URL: http://localhost:5000

GET  /                          → Health check
GET  /igxsecure/api/feed        → Live Instagram posts (Meta Graph API)
GET  /igxsecure/api/system/health → Server uptime + status
```

### Sample Feed Response
```json
{
  "success": true,
  "data": [
    {
      "id": "17846368219941196",
      "caption": "Post caption here",
      "media_type": "IMAGE",
      "media_url": "https://...",
      "timestamp": "2026-04-01T12:00:00+0000"
    }
  ]
}
```

***

## 🔐 Security Architecture

IGXSecure is built security-first — not as an afterthought.

```
✅ Helmet.js — 11 HTTP security headers on every response
✅ CORS      — Locked to http://localhost:3000 (configurable)
✅ Rate limiting — 100 requests per 15 minutes per IP
✅ No passwords stored — OAuth tokens only
✅ .env encrypted — dotenvx AES encryption
✅ Nginx HTTPS — TLS termination at proxy layer
✅ Token isolation — tokens never exposed to frontend
```

***

## 🗺️ Development Roadmap

```
Phase 1  ✅  Static UI — React + Navbar + routing
Phase 2  ✅  Backend Setup — Express + security middleware
Phase 3  ✅  API Integration — Modular routes + health monitoring
Phase 4  ✅  OAuth Flow — Meta login + token exchange + AES-256 encryption
Phase 5  ✅  Instagram Features — Feed, Stories + Insights, Notifications
Phase 6  🟡  Messages — Pending Meta App Review + Business Verification
Phase 7  🔜  Production Launch — Privacy policy + Meta app review + PWA
```

***

## ⚡ Quick Start (Local Development)

```bash
# 1. Clone the repo
git clone https://github.com/108ra/igxsecure.git
cd igxsecure/backend

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env
# Fill in your META_USER_TOKEN, DB credentials, etc.

# 4. Start the server
node server.js

# 5. Test the feed
curl http://localhost:5000/igxsecure/api/feed
```

> ⚠️ Requires a valid Meta Developer App + Instagram Basic Display token in `.env`

***

## 🧪 Test Checklist

```bash
# Health check
curl http://localhost:5000/
# → {"status":"IGXSecure API running"}

# Live Instagram feed
curl http://localhost:5000/igxsecure/api/feed
# → {"success":true,"data":[...posts]}

# 404 handler
curl http://localhost:5000/igxsecure/api/fake
# → {"error":"Route not found"}

# CORS + security headers
curl -I http://localhost:5000/igxsecure/api/feed
# → Access-Control-Allow-Origin, CSP, HSTS, X-Frame-Options...
```

***

## 📜 Legal & Compliance

IGXSecure is built in **full compliance with Meta's Platform Policy**:

- ✅ Uses only the **official Instagram Graph API**
- ✅ OAuth2 authentication — no password storage
- ✅ Access only **user-authorized data**
- ✅ No scraping, no private APIs, no automation
- ✅ Privacy Policy + Terms of Use pages planned (Phase 7)

***

## 📬 Contact

<div align="center">

Built with 🛠️ by **Ravirajsinh Rathod** — Ontario, Canada

*"Own your data. Own your feed. Own your time."*

</div>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2c5364,50:203a43,100:0f2027&height=100&section=footer" width="100%"/>
</div>
