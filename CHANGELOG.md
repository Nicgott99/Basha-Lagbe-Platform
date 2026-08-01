# Changelog

All notable changes to the Basha Lagbe project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-08-02

### ✨ Added

#### Hooks
- **`useFetch` custom hook** (`client/src/hooks/useFetch.js`) — A reusable
  data-fetching hook returning `{ data, loading, error, refetch }`:
  - Uses `AbortController` to cancel in-flight requests on unmount or url change,
    preventing "state update on unmounted component" memory leaks
  - Sends `credentials: 'include'` by default so auth cookies are always sent
  - Parses JSON error bodies for readable messages; ignores `AbortError` silently
  - `refetch(url?, options?)` lets callers re-trigger or change the URL on demand
  - Skip mode: pass `null` as the url to defer the fetch until `refetch` is called
  - Options-ref pattern keeps the dependency array stable
  - Documented with JSDoc and two usage examples
  - Replaces copy-pasted `useEffect + fetch/apiRequest` patterns across pages

#### Frontend UX
- **Live password strength indicator** (`client/src/components/PasswordStrength.jsx`)
  — Displayed below the password field in the Sign Up page:
  - Scores the password on 5 criteria: length ≥8, lowercase, uppercase, digit,
    special character — produces a `score` from 0 to 5
  - Score maps to labels: Very Weak → Weak → Fair → Good → Strong
  - Animated progress bar (300ms width transition) colour-coded red→orange→yellow→green
  - 4-item checklist below the bar — each item gets a green checkmark as it is met
  - Renders nothing when the password field is empty (no layout shift on load)
  - Exports `getPasswordStrength()` separately for reuse in form validation
  - Integrated into `SignUp.jsx` — updates live on every keystroke

#### Backend Security
- **`sanitizeInput` middleware** (`server/middleware/sanitizeInput.js`) — A new
  Express middleware that recursively sanitises `req.body`, `req.query`, and
  `req.params` before they reach any controller:
  - **XSS**: strips `<script>` blocks, HTML tags, and `on*=` event attributes
  - **NoSQL injection**: removes keys that start with `$` (MongoDB operators)
  - **Path traversal**: removes keys containing `.` (dot-notation attacks)
  - **Prototype pollution**: skips `__proto__`, `constructor`, `prototype` keys
  - Handles nested objects and arrays recursively
  - Never crashes a request — sanitisation errors are caught and logged as warnings
  - Applied in `server/index.js` after `express.json()` so the body is parsed first
  - New `server/middleware/` directory created to house future middleware modules

---

## [1.4.0] - 2026-08-01


### ✨ Added

#### Hooks & Utilities
- **`useLocalStorage` custom hook** (`client/src/hooks/useLocalStorage.js`) — A
  drop-in replacement for `useState` that automatically persists and restores
  values from `localStorage`. Supports updater-function form, JSON
  serialisation, and graceful error handling when localStorage is unavailable.
  Integrated into `Search.jsx` so users' view-mode (grid/list) and sort
  preference survive page refreshes without any extra configuration.

#### Frontend UX
- **Floating `BackToTop` button** (`client/src/components/BackToTop.jsx`) — A
  polished floating action button (FAB) that appears after scrolling 300 px
  and smoothly scrolls back to the top on click:
  - Framer Motion `AnimatePresence` for spring enter/exit transitions
  - Hover lifts the button 3px; tap scales it down for tactile feedback
  - Blue/indigo gradient + shadow-glow consistent with the site palette
  - Passive scroll listener to avoid blocking the scroll thread
  - Accessible: `aria-label`, `title`, visible focus ring
  - Wired into `App.jsx` after `<Footer>` so it is globally available

#### Backend
- **Structured request logger** (`server/utils/requestLogger.js`) — Replaces
  two duplicate, ad-hoc `console.log` middlewares in `server/index.js` with a
  single, colour-coded, response-time-aware logger:
  - Fires on the `res.finish` event (logs after the response is sent)
  - Colour-codes HTTP method (GET=green, POST=blue, DELETE=red, etc.)
  - Colour-codes status codes (2xx=green, 4xx=yellow, 5xx=red)
  - Shows response time in milliseconds (using `process.hrtime` for accuracy)
  - Shows client IP address
  - Respects ANSI TTY detection — plain text in non-TTY environments
  - Silent in `NODE_ENV=test` environments

---

## [1.3.0] - 2026-07-31


### ✨ Added

#### UI & Mobile Improvements
- **Working mobile navigation menu** (`client/src/components/Header.jsx`) — The
  hamburger icon existed in the original code but clicking it did nothing at all.
  Now fully implemented with:
  - `isMobileMenuOpen` state toggle showing/hiding a slide-down drawer
  - Hamburger icon switches to an ✕ close icon when the menu is open
  - Full link set inside the drawer: Home, Search Properties, About
  - Role-aware account section for logged-in users (Dashboard, Profile,
    Notifications, Add Property, Inquiries, Applications, Admin Panel)
  - Sign Up Free CTA for logged-out users
  - Every link calls `closeMobileMenu()` so the drawer collapses on navigation
  - Desktop layout completely unchanged
  - Extracted `isAdminOrLandlord`, `isAdmin`, and `avatarUrl()` helpers to
    eliminate duplicated role-check logic across desktop and mobile menus
- **Global Footer component** (`client/src/components/Footer.jsx`) — The app had
  no footer at all; pages ended abruptly after the last content section. Now added:
  - Four-column responsive grid: Brand blurb, Quick Links, Property Types, Contact
  - Brand column with bilingual tagline — English + Bengali ("বাসা লাগবে")
  - Quick Links: Home, Search Properties, About, Sign In, Create Account
  - Property Types: Apartment, House, Studio, Room, Commercial (linked to search)
  - Contact column: location, phone, email with Heroicons
  - Copyright line with dynamic current year
  - Consistent design: `bg-gradient-to-br from-blue-900 to-blue-950` matching
    the Header's blue/indigo palette
  - Wired into `App.jsx` below `<Routes>` so it appears on every page

---

## [1.2.0] - 2026-07-30


### ✨ Added

#### Performance & UX Improvements
- **`useDebounce` custom hook** (`client/src/hooks/useDebounce.js`) — A reusable
  React hook that delays propagating a changing value until after a configurable
  idle period (default 300 ms). Prevents unnecessary re-renders and future API
  calls that would otherwise fire on every single keystroke in search inputs.
  - Fully documented with JSDoc and a usage example
  - Configurable delay via the second argument
  - Properly cleans up the `setTimeout` on each render to avoid stale closures
- **Debounced search in Search page** — Integrated `useDebounce` (400 ms) into
  `client/src/pages/Search.jsx` so `applyFilters` and its `useCallback`/`useEffect`
  dependencies now respond to the debounced query instead of the raw input value
- **`ScrollToTop` component** (`client/src/components/ScrollToTop.jsx`) — A
  side-effect-only component placed inside `<BrowserRouter>` that automatically
  scrolls the page to the top on every route change. Without this, React Router
  preserves the previous scroll position across navigations, so users could land
  halfway down the page on every link click.
  - Uses `window.scrollTo({ top: 0, behavior: 'instant' })` for immediate reset
  - Renders `null` — zero impact on DOM or layout
  - Wired into `App.jsx` above `<Routes>` so it covers every page

---

## [1.1.0] - 2026-07-29


### ✨ Added

#### Security Improvements
- **Helmet middleware** — Applies secure HTTP response headers to every response,
  protecting against well-known web vulnerabilities (XSS, clickjacking, MIME sniffing, etc.)
- **Tiered rate limiting** — Two-level IP-based rate limiting using `express-rate-limit`:
  - Auth endpoints (`/server/auth/*`): strict limiter — 20 requests per 15 minutes —
    to block brute-force and credential-stuffing attacks
  - All API endpoints (`/server/*`): general limiter — 300 requests per 10 minutes —
    to guard against abuse and scraping
  - Responses include standard `RateLimit-*` headers for RFC 6585 compliance
  - Both packages were already listed in `package.json` but were never applied

#### Frontend Improvements
- **Custom 404 Not Found page** (`client/src/pages/NotFound.jsx`) — A polished,
  animated page shown whenever a user navigates to an invalid URL:
  - Floating house icon with Framer Motion spring animation
  - Gradient `404` display with animated background particles
  - Three action buttons: Go Home, Search Properties, Go Back
  - Bilingual copy — English + Bengali ("বাসা পাওয়া গেল না!")
  - Fully responsive (mobile-first) with glassmorphism accents
- **Catch-all route** added to `App.jsx` (`<Route path="*" />`) so the 404 page
  is served for every unrecognised URL instead of a blank white screen

---

## [1.0.0] - 2025-10-02


### 🎉 Initial Release

The first production-ready release of Basha Lagbe - MERN To-Let Platform.

### ✨ Added

#### User Features
- User registration and authentication system
- Email/password login
- Google OAuth integration
- Email verification for new accounts
- Password reset functionality
- User profile management
- Avatar upload and management

#### Property Management
- Create, read, update, and delete property listings
- Multiple image upload for properties (up to 6 images)
- Property details including:
  - Title and description
  - Address and location
  - Price (regular and discounted)
  - Bedrooms and bathrooms count
  - Furnished status
  - Parking availability
  - Property type (rent/sale)
  - Special offers

#### Search & Filter
- Advanced search functionality
- Filter by:
  - Property type (rent/sale)
  - Price range
  - Number of bedrooms
  - Number of bathrooms
  - Furnished status
  - Parking availability
  - Special offers
- Search in property name and description
- Sorting options (price, date, etc.)
- Pagination for search results

#### Reviews & Ratings
- Leave reviews for properties
- 5-star rating system
- Edit and delete own reviews
- View average ratings
- Review moderation

#### Communication
- Inquiry system for property listings
- Contact property owners
- In-app notification system
- Email notifications

#### Admin Features
- Admin dashboard with analytics
- User management
- Property moderation
- Platform statistics
- Application tracking
- Review management

### 🛠️ Technical Implementation

#### Frontend
- React 18 with hooks
- Redux Toolkit for state management
- Redux Persist for state persistence
- React Router v7 for navigation
- Vite as build tool
- Tailwind CSS for styling
- Framer Motion for animations
- Firebase integration for auth and storage
- Axios for API calls
- React Hook Form for form handling
- Swiper for image carousels

#### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- Bcrypt password hashing
- Cookie-based session management
- Multer for file uploads
- Sharp for image processing
- Nodemailer for email service
- Express rate limiting
- Helmet for security headers
- CORS configuration

#### Security
- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- Rate limiting on API endpoints
- Input validation and sanitization
- File upload restrictions
- CORS protection
- Security headers with Helmet

### 📚 Documentation
- Comprehensive README
- API documentation
- Installation guide
- Contributing guidelines
- Security policy
- License (MIT)

### 🎨 UI/UX
- Responsive design for all devices
- Mobile-first approach
- Modern and clean interface
- Intuitive navigation
- Loading states and animations
- Toast notifications
- Error handling with user-friendly messages

### 🚀 Performance
- Code splitting
- Lazy loading for routes
- Image optimization
- Efficient database queries
- Caching strategies
- Pagination for large datasets

---

## [Unreleased]

### 🔮 Planned Features

#### Short-term (Next Release)
- [ ] Real-time chat system
- [ ] Advanced property analytics for owners
- [ ] Saved searches feature
- [ ] Property comparison tool
- [ ] Map view for property locations
- [ ] Dark mode support

#### Medium-term
- [ ] Payment gateway integration
- [ ] Booking system
- [ ] Tenant verification
- [ ] Document upload and management
- [ ] Virtual property tours
- [ ] Multi-language support
- [ ] Push notifications

#### Long-term
- [ ] Mobile application (React Native)
- [ ] AI-powered property recommendations
- [ ] Chatbot for customer support
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations
- [ ] Blockchain for property verification

---

## Version History

### [1.0.0] - 2025-10-02
- Initial public release

---

## Migration Guide

### From Beta to 1.0.0

If you were using a beta version:

1. **Database Migration**
   ```bash
   # Run migration script
   node server/migrations/v1.0.0.js
   ```

2. **Update Environment Variables**
   - Add new required variables (see `.env.example`)
   - Update Firebase configuration

3. **Update Dependencies**
   ```bash
   npm install
   cd client && npm install
   ```

4. **Clear Browser Storage**
   - Clear localStorage
   - Clear cookies
   - Hard refresh (Ctrl+Shift+R)

---

## Deprecation Notices

### v1.0.0
- No deprecations in this release

---

## Contributors

Special thanks to all contributors who made this release possible!

- **Project Lead**: [Your Name]
- **Backend Development**: [Contributors]
- **Frontend Development**: [Contributors]
- **UI/UX Design**: [Contributors]
- **Testing**: [Contributors]

---

For more detailed information about specific changes, please refer to the [commit history](https://github.com/Nicgott99/Basha-Lagbe-MERN-To-Let-Platform/commits/main).
