# Copilot instructions for this repo (Basha Lagbe)

High-level context
- Full‑stack to‑let app. Client is Vite + React 18 + Redux Toolkit + redux‑persist + Tailwind (see `client/`). Server is Express + MongoDB Atlas + Mongoose (see `server/mongodb-server.js` with most routes in a single file) backed by models in `server/models/*` and a thin data layer in `server/services/mongoService.js`.
- All HTTP endpoints are prefixed with `/server/*`. The Vite dev proxy forwards these to the backend on port 5000.

Dev workflows
- Install deps:
  - Root (server): npm install
  - Client: cd client; npm install
- Run dev servers in two terminals:
  - Backend: npm run dev (from repo root; nodemon runs `server/mongodb-server.js` on :5000)
  - Frontend: cd client; npm run dev (Vite on :5173 with proxy to :5000)
- Environment:
  - Backend reads `MONGO_URL` (Atlas URI) and optional `ADMIN_EMAIL`. JWT secret is in code (`mongodb-server.js`) for now. CORS allows http://localhost:5173 by default.
  - Frontend reads `VITE_API_URL` (optional; leave empty to use Vite proxy) and Firebase `VITE_FIREBASE_*` keys.

Architecture and data flow
- Client uses `client/src/utils/apiService.js` as the single HTTP surface. Requests:
  - default baseURL is empty so fetch calls like `request('/server/auth/signin', { credentials: 'include' })` go through Vite proxy.
  - Cookies: auth uses an `access_token` cookie; `credentials: 'include'` is required.
- Server mounts routes directly in `server/mongodb-server.js`:
  - Auth: `/server/auth/{send-verification,verify-email,signup,signin,verify-signin,complete-signin,signout}`. Sign‑in is two‑step email code via `EmailVerification` model (TTL 10 min).
  - Listings: `/server/listing/{all,search,create}`. Create requires JWT via `verifyToken` (cookie or `Authorization: Bearer ...`). Approved items use `verificationStatus: 'approved'` (see `models/property.js`).
  - Admin: `/server/admin/properties/pending` (GET), `/server/admin/properties/:id/moderate` (POST approve/reject); guarded by `verifyAdmin`.
  - Applications: `/server/applications/{submit,my}`.
  - Notifications: `/server/notifications/{my}` (GET), `/:id/read` (POST).
  - Health/stats: `/server/health`, `/server/analytics/stats` (admin only).
- Data layer: `server/services/mongoService.js` connects to Mongo, ensures an admin user, stores/validates email codes, and provides helpers (e.g., `findUserByEmail`, `createUser`, `getDatabaseStats`). Some route‑referenced methods like `findProperties`, `createProperty`, `moderateProperty`, `createApplication`, `getUserNotifications`, etc. are referenced by the server but not fully present in the service file—add them here to keep DB access centralized.

Conventions and patterns
- API surface (client): Prefer `apiService` methods instead of ad‑hoc fetch. Example: `apiService.auth.signin(email, password)` → awaits `{ success, requiresVerification, email }` then `apiService.auth.completeSignin(email, code)`.
- API surface (server):
  - Prefix all routes with `/server/` so the Vite proxy applies.
  - Standard response shapes used in this code: on error `{ success:false, message }`; on success either `{ success:true, message, ... }` or a bare array for list endpoints. For new endpoints, prefer `{ success:true, data: ... }` to align with `App.jsx` token verification expectation.
  - Auth middleware: `verifyToken` checks cookie `access_token` or Authorization header; `verifyAdmin` checks `req.user.accountType === 'admin'`.
- Models: Use `server/models/User.js` and `server/models/property.js` as the current schemas. Both include legacy fields for backward compatibility (e.g., `personalInfo` and top‑level `fullName`, `rentPrice` alongside `pricing.rent.monthly`). When querying, filter by both new and legacy paths as seen in `property.js` static `advancedSearch`.
- Routing/UI:
  - Routes defined in `client/src/App.jsx`. Private areas are wrapped by `components/PrivateRoute.jsx` (checks `state.user.currentUser`). Admin panel gate accepts `currentUser.accountType === 'admin'` or legacy `role === 'admin'`.
  - Redux slice is `client/src/redux/users/userSlice.js`; persisted via `redux-persist`. Loading gates show `components/LoadingSpinner.jsx`.

Gotchas and mismatches to be aware of
- `App.jsx` calls `apiService.auth.verifyToken()` → no `/server/auth/verify-token` exists. Implement a GET route that decodes cookie and returns `{ success:true, data:{ user } }` or change the client.
- Notifications mark‑as‑read: server exposes `POST /server/notifications/:id/read` but `apiService.notifications.markAsRead` uses PUT. Align one side.
- `apiService` references `window.__REDUX_STORE__` for sign‑out on auth errors; this store is not assigned anywhere. Either attach the store in `main.jsx` (e.g., `window.__REDUX_STORE__ = store`) or remove that path.

When adding backend endpoints
- Put DB reads/writes in `server/services/mongoService.js` (add missing methods used by routes), keep route handlers in `mongodb-server.js`, and reuse `verifyToken/verifyAdmin` for auth.
- Keep responses consistent and always `credentials: 'include'` on the client.

Quick example (client):
```js
// Search approved listings with filters
const items = await apiService.properties.search('Dhanmondi', { minPrice: 5000, propertyType: 'apartment' });
```

Tell us if any section is unclear or incomplete (e.g., missing mongoService methods you plan to use); we’ll refine these instructions to match your task. 