IGXSecure(Clinsta) — Full Project Specification \& Development Blueprint



1\. Project Overview

Project Name: IGXSecure(will change the name from "Clinsta" to "IGXSecure")

Type: Self-hosted secure web application

Primary Goal:

Create a distraction-free Instagram interface that allows users to:



* Access messages (DMs)
* View stories and posts
* Exclude Reels and discovery content
* Maintain privacy, security, and legal compliance



2\. Core Requirements

**Functional Requirements**

1. User login via Instagram OAuth (Meta API)
2. Display:

   * Messages
   * Stories
   * Posts from followed accounts
   * reels from followed accounts

3\. no explore feed, or algorithmic content or, ads  or, suggestions

4\. Allow viewing of shared reels only (direct message content) — no scrolling

5\. Multi-user support (future phase)



Non-Functional Requirements

* Fully self-hosted
* High security (no token leaks)
* Low latency UI
* Mobile-friendly (PWA-ready)
* Scalable architecture



3\. Legal \& Compliance Constraints (CRITICAL)



The system MUST comply with Meta (Instagram) policies:



✅ Allowed:

* Use Instagram Graph API
* Use OAuth2 authentication
* Access user-authorized data only



❌ Forbidden:

* Scraping Instagram web pages
* Using unofficial/private APIs
* Storing user passwords
* Automating Instagram actions



Required:

* Privacy Policy page
* Terms of Use page
* Secure token handling
* HTTPS only





4\. System Architecture

\[User Browser]

&#x20;    ↓

https://hostname/igxsecure

&#x20;    ↓

\[Nginx Reverse Proxy]

&#x20;    ↓

&#x20;┌─────────────────────────────┐

&#x20;│ IGXSecure Application Layer │

&#x20;├──────────────┬──────────────┤

&#x20;│ Frontend     │ Backend API  │

&#x20;│ (Static/PWA) │ (Node.js)    │

&#x20;└──────┬───────┴──────┬───────┘

&#x20;       ↓              ↓

&#x20;  UI Rendering   Business Logic

&#x20;                       ↓

&#x20;               Instagram Graph API

&#x20;                       ↓

&#x20;                  Meta Servers



5\. Technology Stack

Frontend

* HTML5 / CSS3 / Vanilla JS (Phase 1–2)
* React.js (optional upgrade)
* Fetch API for backend communication



Backend

* Node.js (Express)
* Security:
* Helmet
* express-rate-limit
* CORS (restricted origin)



Database

* Phase 1: None
* Phase 3+: SQLite → PostgreSQL



Infrastructure

* Nginx (reverse proxy)
* systemd (service management)
* Ubuntu Server





7\. Backend API Design



Base URL

/igxsecure/api/



Route Structure

1\. System Routes

GET /system/health



Returns:



{

&#x20; "status": "ok",

&#x20; "uptime": 12345,

&#x20; "hostname": "server-name"

}



2\. Auth Routes (Phase 4)

GET /auth/login

GET /auth/callback

GET /auth/status

POST /auth/logout



3\. Instagram Data Routes (Future)

GET /messages

GET /stories

GET /posts

GET /media/:id



4\. Logs \& Monitoring

GET /logs/latest





8\. Frontend Requirements

Pages

Landing Page

&#x09;Connect Instagram button

Dashboard

&#x09;Messages panel

&#x09;Stories panel

&#x09;System status

Settings

&#x09;Logout

&#x09;Security info



UI Behavior

* Minimal, distraction-free
* Dark mode default
* No autoplay media
* No infinite scrolling



9\. Security Architecture

Network Level

Backend bound to:

127.0.0.1:9000



Access Control

Only accessible via Nginx

HTTPS enforced



Application Security

Helmet headers enabled

Rate limiting active

CORS restricted to:

https://hostname



Token Security

Store tokens:

Encrypted (AES-256 or Node crypto)

Never expose tokens to frontend

Use environment variables



10\. Meta Developer Integration Plan

Steps

Create app at:

👉 https://developers.facebook.com



Configure:

App Name: IGXSecure

Domain: later

Redirect URI:

https://carweb.ddns.net/igxsecure/api/auth/callback



Permissions Required

* instagram\_basic
* pages\_show\_list
* instagram\_manage\_messages



Flow

User clicks login

→ Redirect to Meta OAuth

→ User approves

→ Callback with code

→ Exchange for token

→ Store securely



11\. Phase-wise Development Plan

Phase 1 — Static UI



✔ HTML/CSS/JS

✔ Nginx routing



Phase 2 — Backend Setup



✔ Express server

✔ Security middleware

✔ systemd service



Phase 3 — API + Integration



✔ Modular routes

✔ Frontend API calls

✔ System health monitoring



Phase 4 — OAuth Integration



⬜ Meta login

⬜ Token exchange

⬜ Secure storage

&#x20;

Phase 5 — Data Layer



⬜ Fetch messages

⬜ Display stories

⬜ UI refinement



Phase 6 — Multi-user



⬜ User accounts

⬜ Token isolation



Phase 7 — Production Launch



⬜ Privacy policy

⬜ Terms of use

⬜ Meta app review



12\. Deliverables for AI Development

Core Deliverables

* Backend (Node.js Express project)
* Frontend (HTML/CSS/JS or React)
* Nginx configuration snippets
* OAuth integration module
* Database schema (future)
* Security implementation
* Deployment scripts





File Structure

&#x20;Choose right file structure form security perspective.



13\. Constraints for AI



When generating code, AI must follow:



* Do NOT use scraping
* Do NOT store passwords
* Use only official APIs
* Follow modular code structure
* Use environment variables
* Apply security headers



Future Expansion

* PWA (mobile app-like experience)
* iOS wrapper (private app)
* Analytics dashboard
* Notification system
* Cloud deployment (optional)



15\. Final Summary



IGXSecure is a:



Secure

Self-hosted

API-driven

Legally compliant



platform designed to redefine Instagram usage into a controlled, productivity-focused environment.



