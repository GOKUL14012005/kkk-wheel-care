# KKK Wheel Care — Integrated Academic Web Application

An integrated full-stack web application designed for **KKK Wheel Care**, an automotive and vehicle-care business with specialized divisions:
- **Tyre Sales & Expert Matching** (MRF, Apollo, Bridgestone, Michelin, Goodyear, CEAT)
- **High-Precision Wheel Services** (German 3D computerized alignment, dynamic balancing, nitrogen inflation)
- **Automotive & Commercial Batteries** (Amaron, Exide, SF Sonic)
- **Sustainable Allied Division** (Solar water heating systems & multi-stage RO water purification)

---

## 📋 Academic Assignment Requirements Tracking Matrix

Every mandatory requirement is mapped to its exact architecture location and verification status:

| # | Requirement Specification | Status | Implementation Location | Verified Features |
|:---:|:---|:---:|:---|:---|
| **1** | **HTML5 & CSS3** website structure and styling | **VERIFIED** | `classic-web/index.html`, `classic-web/css/style.css` | Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`), CSS3 variables, gradients, responsive cards, transitions |
| **2** | **Bootstrap UI** with Home, Sign-up, and Login pages | **VERIFIED** | `classic-web/index.html`, `classic-web/register.html`, `classic-web/login.html` | Bootstrap 5 grid, responsive navbar, form controls, modals, badges, cards |
| **3** | **JavaScript Form Validation** for registration, login, profile, and payment | **VERIFIED** | `classic-web/js/validation.js`, `register.html`, `login.html`, `profile.html`, `payment.html` | Real-time email syntax, 10-digit mobile, vehicle reg format, password strength meter, confirm password match, 16-digit card formatting & expiry checks |
| **4** | **jQuery DOM Traversal & Manipulation** | **VERIFIED** | `classic-web/js/jquery-interactions.js`, `catalogue.html`, `jquery-demo.html` | Explicit traversal (`.parent()`, `.closest()`, `.children()`, `.find()`, `.siblings()`), dynamic filtering, `.append()`, `.remove()`, `.slideToggle()`, and interactive visual log |
| **5** | **Node.js HTTP Server** | **VERIFIED** | `backend/server.js`, `backend/routes/health.routes.js` | Express HTTP server, JSON error handlers, static file serving integration, CORS, and `GET /api/health` |
| **6** | **Three-Tier Architecture** (Node.js & MySQL with CRUD) | **VERIFIED** | `backend/models/`, `backend/services/`, `backend/controllers/`, `backend/database/schema.sql` | 3-tier separation (DAL, BLL, Controllers), MySQL database `kkk_wheel_care`, parameterized SQL queries, bcrypt password hashing, 11 automated CRUD tests verified |
| **7** | **Angular Reactive Forms** with Validation | **VERIFIED** | `frontend/src/app/pages/register/`, `frontend/src/app/pages/bookings/`, `frontend/src/app/pages/login/` | ReactiveFormsModule, FormBuilder, FormGroup, custom password match validator, pattern validators, live field feedback |
| **8** | **Angular Routing & Navigation** | **VERIFIED** | `frontend/src/app/app.routes.ts`, `frontend/src/app/app.html` | Client-side Angular 20 SPA routing for Home, Products, Bookings, Profile, Login, Register, and 404 wildcard fallback |
| **9** | **Node.js Seneca Microservice** | **VERIFIED** | `microservices/tyre-recommendation/service.js`, `backend/routes/recommendation.routes.js` | Pattern matching `{ role: 'recommendation', action: 'matchTyre' }`, input validation, catalogue integrity rules, Express proxy endpoint |
| **10** | **Deployment Preparation & Mobile Extension** | **VERIFIED** | `deployment/`, `frontend/public/manifest.webmanifest`, `frontend/public/sw.js`, `frontend/capacitor.config.ts` | Multi-stage Dockerfiles (Frontend, Backend, Seneca), docker-compose, PWA manifest, service worker safe caching, SVG icons, Capacitor configuration |

---

## 🚀 How to Run the Initial Website Locally (Beginner Friendly)

You do **not** need to install any extra servers to run the initial website! You can use Python or Node.js, both of which are already installed on your machine.

### Method 1: Using Python (Recommended - 1 Command)

1. Open PowerShell or Command Prompt inside the `KKK-Wheel-Care` folder:
   ```powershell
   cd classic-web
   python -m http.server 3000
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

### Method 2: Using Node.js (npx serve)

1. Open PowerShell:
   ```powershell
   cd classic-web
   npx serve . -p 3000
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

### Method 3: Running the Full-Stack Express HTTP Server (Phase 2)

The Express HTTP server can serve both the REST API and the frontend simultaneously:

1. Open PowerShell:
   ```powershell
   cd backend
   npm start
   ```
2. Visit in your browser:
   - **Frontend Application**: `http://localhost:5000`
   - **Health Check API**: `http://localhost:5000/api/health`
   - **Products API**: `http://localhost:5000/api/products`
   - **Bookings API**: `http://localhost:5000/api/bookings`
   - **Customer Auth API**: `http://localhost:5000/api/customers/register`

### Method 4: Running the Angular Frontend (Phase 3)

1. Open PowerShell:
   ```powershell
   cd frontend
   npm start
   ```
2. Navigate in your browser to:
   ```
   http://localhost:4200
   ```
3. Navigable routes in Angular:
   - `http://localhost:4200/home` — Landing page with live API health status
   - **Products API**: `http://localhost:4200/products` — Live MySQL product catalogue with Seneca Smart Tyre Advisor
   - `http://localhost:4200/bookings` — Angular Reactive Form appointment booking with mock payment
   - `http://localhost:4200/register` — Angular Reactive Form customer registration with custom validators
   - `http://localhost:4200/login` — Angular Reactive Form customer sign-in with 1-click test fill
   - `http://localhost:4200/profile` — Customer vehicle garage and service booking history

### Method 5: Running the Seneca Microservice (Phase 4)

1. Open PowerShell:
   ```powershell
   cd microservices/tyre-recommendation
   npm start
   ```
2. The Seneca pattern-matching microservice will listen on port `5001`.
   - Health check: `http://localhost:5001/health`
   - Direct pattern invoke: `POST http://localhost:5001/act`
   - Express Backend proxy: `POST http://localhost:5000/api/recommendations/tyres`

### Method 6: Multi-Container Docker Deployment (Phase 5)

When Docker Desktop is installed:
1. Copy the docker environment template:
   ```powershell
   cp deployment/.env.docker.example deployment/.env
   ```
2. Build and launch all 4 services (MySQL, Seneca, Express Backend, Angular Nginx):
   ```powershell
   docker compose -f deployment/docker-compose.yml up --build -d
   ```
3. Access at `http://localhost` (Nginx reverse proxies `/api` requests to `backend:5000`).

---

## 📱 Progressive Web App (PWA) & Mobile Extension

* **Web App Manifest**: Located at `frontend/public/manifest.webmanifest`.
* **Service Worker**: Located at `frontend/public/sw.js` with **strict security rules**:
  * Static assets (`index.html`, bundles, SVG icons) are cached for offline resilience.
  * Sensitive user endpoints (`/api/customers`, `/api/bookings`, `/api/customers/login`) **bypass the cache** to preserve privacy and prevent credential leaks.
* **Mobile Viewport**: Optimized with `viewport-fit=cover`, `#d90429` theme color, and Bootstrap responsive grid.
* **Capacitor Mobile Configuration**: Configured in `frontend/capacitor.config.ts` with App ID `com.kkkwheelcare.app` for Android and iOS wrapping.




---

## 🗄️ MySQL Database Setup (Three-Tier Architecture)

1. Copy `backend/.env.example` to `backend/.env`.
2. Configure your local MySQL root password in `backend/.env`:
   ```ini
   DB_PASSWORD=your_actual_mysql_password
   ```
3. Import the database schema:
   ```powershell
   mysql -u root -p kkk_wheel_care < backend/database/schema.sql
   ```
   *(Or open `backend/database/schema.sql` in MySQL Workbench and execute the script).*


---

## 📂 Project Architecture

```text
KKK-Wheel-Care/
├── classic-web/                      # [Req 1, 2, 3, 4] HTML5, CSS3, Bootstrap 5, JS & jQuery
│   ├── css/
│   │   └── style.css                 # Custom CSS3 styling, variables, animations
│   ├── js/
│   │   ├── validation.js             # Form validation for Register, Login, Profile, Payment, Booking
│   │   └── jquery-interactions.js    # jQuery DOM traversal (.parent, .closest, .find, .siblings) & manipulation
│   ├── index.html                    # Home page with business overview & smart tyre finder
│   ├── register.html                 # Customer signup with real-time password strength meter
│   ├── login.html                    # Customer sign-in with 1-click demo credentials auto-fill
│   ├── profile.html                  # Customer profile, vehicle garage & service history
│   ├── payment.html                  # Mock payment gateway (Card & UPI simulation)
│   ├── catalogue.html                # Tyres, Batteries, Solar & Purifiers with live estimate drawer
│   ├── booking.html                  # Workshop service booking appointment form
│   └── jquery-demo.html              # Dedicated DOM Traversal & Manipulation Academic Laboratory
│
├── backend/                          # [Req 5 & 6] Node.js Express REST API & MySQL 3-Tier Layer (Phase 2)
├── frontend/                         # [Req 7 & 8] Angular SPA with Reactive Forms & Routing (Phase 3)
├── microservices/                    # [Req 9] Seneca.js Tyre Recommendation Engine (Phase 4)
├── mobile-extension/                 # [Req 10] PWA & Mobile wrapper (Phase 5)
├── deployment/                       # [Req 10] Dockerfile & deployment config (Phase 5)
└── README.md                         # Project documentation and requirement tracker
```

---

## 🧪 Testing What Works in Phase 1

1. **Home Page (`index.html`):**
   - Responsive Bootstrap 5 layout with navigation, hero section, business highlights, and dynamic tyre finder.
2. **Registration Validation (`register.html`):**
   - Try submitting with empty or weak fields to see instant feedback messages.
   - Type in the password field to watch the live color-coded strength bar change.
   - Successful submission saves the session into `localStorage` and redirects to `profile.html`.
3. **Login Validation (`login.html`):**
   - Click the **"Auto-Fill"** button to load the evaluation credentials (`customer@kkkwheelcare.com` / `KkkCare@2026`).
   - Validates email and password, stores auth state, and signs in.
4. **Profile Management (`profile.html`):**
   - Displays customer information, multiple vehicles in the garage, and past workshop history.
   - Real-time field validation when updating phone, city, or postal code.
5. **Mock Payment & Checkout (`payment.html`):**
   - Select between **Credit/Debit Card** and **Instant UPI**.
   - Formats 16-digit card numbers with automatic spacing.
   - Validates cardholder name, expiry, CVV, or UPI ID.
   - Displays a simulated receipt modal with transaction reference (`TXN-KKK-xxxxxx`).
6. **jQuery DOM Traversal Lab (`jquery-demo.html`):**
   - Click `.parent()`, `.closest()`, `.find()`, and `.siblings()` to see animated visual highlight boxes appear on target DOM elements while the exact traversal path is streamed to the live on-screen console.
   - Test DOM manipulation triggers (`.prepend()`, `.slideToggle()`, `.animate()`, `.remove()`).
