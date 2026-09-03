# Changelog

All notable changes to the Basha Lagbe project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.24.0] - 2026-09-04

### 🔐 Security & Architecture

#### Complete JWT Centralization & Fallback Secret Eradication
- **`auth.controller.js`** (`server/controllers/auth.controller.js`):
  - Completely removed all remaining direct calls to `jwt.sign()`, `jwt.verify()`, and manual cookie setting/clearing.
  - Migrated `completeSignin`, `google` (login & register), and `github` (login & register) to `signToken()` and `setTokenCookie()`.
  - Migrated `signOut` to standardized `clearTokenCookie(res)`.
  - Migrated `verifyToken` auth status endpoint to async `verifyJwt(token)`.
  - Removed direct `jsonwebtoken` dependency from `auth.controller.js`.
  - **100% elimination of hardcoded fallback secrets**: completely erased all occurrences of the insecure fallback secret across all OAuth and sign-in handlers.
- **`verifyUser.js`** (`server/utils/verifyUser.js`):
  - Refactored `verifyToken` middleware to verify tokens via `verifyJwt(token)` from `jwtUtils.js`.
  - Removed duplicate local `JWT_SECRET` extraction and direct `jsonwebtoken` dependency.
  - All token verification and generation in the application is now unified under `jwtUtils.js`.

---

## [2.23.0] - 2026-09-03

### 🔐 Security — Commit 1/2

#### Utils
- **`jwtUtils.js`** (`server/utils/jwtUtils.js`) — centralized JWT helper
  functions. Previously an empty placeholder file (0 bytes).

  **Critical problem fixed**: `jwt.sign()` was called in 6+ controller functions
  with a hardcoded fallback secret:
  ```js
  // BEFORE (in auth.controller.js) — INSECURE
  jwt.sign(payload,
    process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369',
    { expiresIn: '7d' }
  );
  ```
  If `JWT_SECRET` is undefined (e.g. missing `.env` file in a new deployment),
  the app silently falls back to this known, source-code-visible string.
  Anyone who reads the GitHub repo can forge tokens for any user, including admins.

  **Solution**: `jwtUtils.js` provides:
  - `signToken(payload, options)` — signs a JWT with **no fallback**; throws if
    `JWT_SECRET` is missing (already guaranteed by `validateEnv` at startup)
  - `verifyJwt(token)` — promise-based verify (no callback API)
  - `decodeJwt(token)` — decode without verification (for logging only)
  - `setTokenCookie(res, token)` — sets `access_token` cookie with consistent
    `httpOnly`, `secure`, `sameSite: strict`, `maxAge: 7d` config
  - `clearTokenCookie(res)` — clears the cookie on sign-out
  - `TOKEN_TTL = '7d'` / `TOKEN_TTL_MS` — shared expiry constants so token
    lifetime and cookie `maxAge` can never get out of sync

#### Controllers Updated
- **`auth.controller.js`** — first adoption of `jwtUtils`:
  - Added `import { signToken, setTokenCookie } from '../utils/jwtUtils.js'`
  - `completeSignup`: replaced `jwt.sign(...hardcodedFallback...)` + manual
    `.cookie(...)` chain → `signToken(...)` + `setTokenCookie(res, token)`
  - `signin`: same replacement for the sign-in path
  - Both paths now fail fast if `JWT_SECRET` is missing rather than silently
    using an insecure fallback

### 🎨 UX — Commit 2/2

#### Components
- **`SkeletonCard`** — the component already existed but was not being used.
  Two pages had their own ad-hoc inline loading placeholders instead:

  **`Search.jsx`** (before):
  ```jsx
  {[...Array(6)].map((_, index) => (
    <div key={index} className="bg-white rounded-xl animate-pulse">
      <div className="h-64 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  ))}
  ```

  **`Home.jsx`** (before):
  ```jsx
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
  ```

  **Problems with the above**:
  - `SkeletonCard` has a proper multi-gradient shimmer animation (`animate-shimmer`)
    that is significantly more polished than `animate-pulse` (flat grey)
  - The inline skeleton in Search used hardcoded `Array(6)` — it ignored the
    `pageSize` value from `useNetworkAwareLoading` (added in v2.21.0)
  - The spinner in Home gave no layout preview — users didn't know if 2 or 20
    cards were coming, causing a jarring layout shift on load
  - Code was duplicated instead of using the existing purpose-built component

#### Pages Updated
- **`Search.jsx`**:
  - Removed 14-line inline animate-pulse skeleton
  - Replaced with `<SkeletonCard count={pageSize || 6} variant="default" />`
  - `count` now uses `pageSize` from `useNetworkAwareLoading` — on slow
    connections (2G), shows 4 skeletons instead of 6 (matching reduced data)
  - Added `import SkeletonCard from '../components/SkeletonCard'`

- **`Home.jsx`**:
  - Removed the generic blue spinner
  - Replaced with a 3-card `<SkeletonCard count={3} variant="default" />` grid
    matching the featured properties layout — no more layout shift on load
  - Added `import SkeletonCard from '../components/SkeletonCard'`

---

## [2.22.0] - 2026-09-02



### ⌨️ Accessibility & UX — Commit 1/2

#### Hooks
- **`useKeyboardShortcuts` hook** (`client/src/hooks/useKeyboardShortcuts.js`) —
  Registers multiple keyboard shortcuts from a single declarative map, using
  one shared `keydown` event listener for all shortcuts (O(1) key lookup).

  **Problem**: `useKeyPress` handles one shortcut per call. Pages that need
  5+ shortcuts (Search: focus, filters, escape; AdminPanel: approve, reject,
  select-all) would need 5 separate `useKeyPress` calls, creating 5 separate
  `keydown` event listeners — wasteful and verbose.

  **Solution**: A single hook that registers all shortcuts via one listener:
  ```js
  useKeyboardShortcuts({
    focusSearch:   { key: 'k', ctrl: true, handler: focusInput },
    toggleFilters: { key: 'f', ctrl: true, handler: toggleFilters },
    closeOrClear:  { key: 'Escape', handler: handleEscape, ignoreInputs: false },
  });
  ```

  Features:
  - `ctrl`/`shift`/`alt` modifier combinations (Ctrl=Cmd on Mac)
  - `ignoreInputs: true` (default) — skips shortcut when user is typing
    in an `<input>`, `<textarea>`, or `contenteditable`
  - `ignoreInputs: false` — for shortcuts that should fire even during typing
    (e.g. Escape to close a modal while typing in it)
  - `preventDefault: true` (default) — prevents browser default behaviour
    (Ctrl+K opening URL bar, Ctrl+S showing save dialog)
  - `enabled` — per-shortcut toggle (disable individual shortcuts conditionally)
  - Global `enabled` option — disables ALL shortcuts (e.g. when modal is open)
  - Uses `useRef` for the shortcuts map — avoids re-creating the event listener
    on every render while still having access to latest handler closures

#### Pages Updated
- **`Search.jsx`** — integrated `useKeyboardShortcuts`:
  - `Ctrl+K` → focuses the search input (industry-standard: GitHub, Linear, Notion)
  - `Ctrl+F` → toggles the filter panel open/closed
  - `Escape` → closes filter panel (if open), or clears search query (if typing)
  - Added `ref={searchInputRef}` to the `<input>` element
  - Updated placeholder to include `(Ctrl+K)` hint for discoverability

### 🔒 Security — Commit 2/2

#### Middleware
- **`slowDown.js`** (`server/middleware/slowDown.js`) — progressive response
  delay middleware for Express. Slows repeat requests rather than hard-blocking,
  creating a gentler but still effective first layer of defence.

  **Problem**: The existing `express-rate-limit` hard-blocks with 429 after 20
  auth requests in 15 minutes. This is too aggressive for legitimate users:
  - A user on a flaky mobile connection (common in Bangladesh) who retries a
    failed login 6 times gets hard-blocked and sees an error page.
  - Bots can detect 429s, back off, and resume when the window resets.

  **Solution**: Progressive delay as the *first* response to repeat requests:

  | Requests/minute | Delay |
  |---|---|
  | 1–5 | 0ms (instant) |
  | 6 | 500ms |
  | 7 | 1,000ms |
  | 8 | 1,500ms |
  | ... | ... |
  | 15+ | 5,000ms (cap) |

  - A legitimate user who retries 3 times gets instant responses — no impact.
  - A bot trying 50 requests/minute is throttled to 5s/request → only 12 requests
    actually complete per minute instead of 50.
  - After the delay, requests still succeed (unlike 429) — so users aren't
    blocked, but brute-force attacks become impractical.

  **API**:
  - `createSlowDown(options)` — factory function returning an Express middleware
  - Options: `windowMs`, `freeRequests`, `delayAfter`, `maxDelay`, `keyGenerator`, `skip`
  - Response headers: `X-SlowDown-Limit`, `X-SlowDown-Remaining`, `X-SlowDown-Delay-ms`
  - Zero dependencies — native `setTimeout` + `Map` (no Redis required)
  - Cleanup interval runs every 5 minutes, `unref()`'d to allow graceful shutdown

#### Server Updated (`server/index.js`)
- Auth endpoint middleware stack changed from:
  `authLimiter → authRoutes`
  to:
  `authSlowDown → authLimiter → authRoutes`

  Config: 5 free requests/minute, then +500ms/request, capped at 5s.
  Hard rate limit still fires at 20 requests/15min as before.

---

## [2.21.0] - 2026-09-01



### 📶 UX — Commit 1/2

#### Hooks
- **`useNetworkAwareLoading` hook** (`client/src/hooks/useNetworkAwareLoading.js`) —
  Derives actionable loading strategy decisions from the user's network condition.
  Builds on the existing `useNetworkSpeed` and `useOnlineStatus` hooks (already
  in the codebase) to give components a single declarative object.

  **Problem**: `useNetworkSpeed` returned raw data (effectiveType, downlink, rtt)
  but components still had to independently decide what to do with it. Nothing in
  the app actually *used* the network speed data despite the hook existing.
  Meanwhile, full-resolution property images (600KB+) load on 2G (~100kbps)
  connections and take 48+ seconds — a major issue for Bangladesh mobile users
  on Grameenphone/Robi/Banglalink 2G/3G networks.

  **Solution**: A single hook that translates raw connection data into decisions:

  | Property | Fast (4G) | Medium (3G) | Slow (2G/saveData) | Offline |
  |---|---|---|---|---|
  | `quality` | `'fast'` | `'medium'` | `'slow'` | `'offline'` |
  | `shouldLazyLoad` | false | true | true | false |
  | `shouldReduceMotion` | false | false | true | true |
  | `shouldUseLowRes` | false | false | true | true |
  | `pageSize` | 12 | 8 | 4 | 0 |
  | `showSlowBanner` | false | false | true | false |

  Also respects `prefers-reduced-motion` OS setting for accessibility.
  Uses `useMemo` — only recomputes when network state actually changes.

#### Pages Updated
- **`Search.jsx`** — integrated `useNetworkAwareLoading`:
  - Added slow connection amber banner above results grid, visible on 2G/slow-3G,
    showing `effectiveType` and `pageSize` so users understand why fewer results
    appear: *"Slow connection detected (2G). Showing 4 per page."*
  - `pageSize` from the hook is now available for future pagination integration.
  - `shouldReduceMotion` extracted for animation gating.

### ⚡ Server — Commit 2/2

#### Utils
- **`cacheHelper.js`** (`server/utils/cacheHelper.js`) — lightweight, zero-dependency
  in-memory TTL cache using a native `Map` for slow-changing server data.

  **Problem**: Several endpoints run expensive, frequently-identical MongoDB queries
  on every single request:

  `GET /server/admin/real-stats` runs **4 × `countDocuments()`** on every Home
  page load. With 100 concurrent users, that's 400 MongoDB operations/minute for
  data that only changes when a new listing is created or a user registers — at
  most a few times per hour. This wastes DB connections, adds 20–80ms latency per
  request, and reduces overall server throughput under load.

  **Solution**: A cache-aside pattern with TTL eviction:
  ```js
  // Before: 4 DB queries on every request (20–80ms)
  const total = await Property.countDocuments();

  // After: 4 DB queries once per 5 minutes (< 1ms on cache hit)
  const stats = await getOrSet('admin:real-stats', async () => {
    const total = await Property.countDocuments();
    return { total };
  }, 300); // TTL: 5 minutes
  ```

  **API surface**:
  - `getOrSet(key, fetcher, ttlSeconds)` — primary function; cache-aside pattern
  - `get(key)` — read cache without computing (returns `undefined` on miss)
  - `set(key, value, ttlSeconds)` — write explicitly
  - `invalidate(key)` — delete a specific entry (call after data changes)
  - `invalidatePattern(prefix)` — delete all keys starting with prefix
  - `flush()` — clear entire cache (use sparingly; testing/migrations only)
  - `stats()` — return `{ size, keys }` for health checks

  **Design**:
  - Zero dependencies — native `Map`, no Redis/memcached to configure
  - Lazy eviction on read — expired entries deleted on access
  - Periodic cleanup — 10-minute `setInterval` sweeps stale entries to prevent
    memory growth in long-running server instances
  - `timer.unref()` — cleanup interval doesn't prevent graceful process exit
  - Not suitable for: user-specific data, session state, or data that must be
    immediately consistent after writes

#### Routes Updated
- **`statsRoutes.js`** — applied `cacheHelper.getOrSet` to `GET /server/admin/real-stats`:
  - Cache key: `'admin:real-stats'`, TTL: 300 seconds (5 minutes)
  - Cache hit: stats served from memory in < 1ms (vs. 20–80ms from MongoDB)
  - Cache miss: 4 DB queries run, result cached for next 5 minutes
  - Fallback: `try/catch` still returns zeros on any error (same as before)
  - Net effect: ~95% reduction in MongoDB reads for the stats endpoint

---

## [2.20.0] - 2026-08-31



### ✨ Added — Commit 1/2

#### Hooks
- **`useFormPersistence` hook** (`client/src/hooks/useFormPersistence.js`) —
  Auto-saves multi-step form state to `sessionStorage` on every change (debounced
  500ms) and restores it on page return, preventing data loss on refresh/crash.

  **Problem**: The AddProperty multi-step form (4 steps, 15+ fields) had zero
  persistence. If a landlord fills in 3 of 4 steps and accidentally presses F5,
  closes the tab, or the browser crashes — all work is lost. This kills listing
  creation completion rates, especially on mobile where crashes are more common.

  **Solution**: Drop-in replacement for `useState` that transparently persists
  to `sessionStorage`:

  ```js
  // Before
  const [formData, setFormData] = useState(initialState);

  // After — identical API, adds auto-save and restore
  const [formData, setFormData, { clearPersisted, hasPersisted }] =
    useFormPersistence('add-property-draft', initialState);
  ```

  **Why sessionStorage (not localStorage)**:
  - Cleared when the tab closes — no stale drafts from days ago
  - Isolated per tab — two tabs for different listings don't interfere

  Features:
  - `debounceMs` (default 500) — batches writes, no write on every keystroke
  - `excludeFields` — skip fields from persistence (e.g. imageUrls to avoid
    QuotaExceededError on base64 image data)
  - `clearPersisted()` — call on successful submit to erase the draft
  - `hasPersisted` — true if restored data was found on mount (show banner)
  - `lastSaved` — Date of last save (show "Auto-saved 2s ago")
  - Custom `serialize`/`deserialize` — for Date objects or complex structures
  - `enabled=false` — disables persistence entirely (for testing)
  - Gracefully handles `QuotaExceededError` (storage full) without crashing

#### Pages Updated
- **`AddProperty.jsx`** — integrated `useFormPersistence`:
  - Replaced `useState` for `formData` with `useFormPersistence`
  - `imageUrls` excluded from persistence (avoids QuotaExceededError on
    large base64-encoded image data)
  - `clearPersisted()` called on successful submit (erases draft)
  - "Draft restored" info banner shown at top of form when `hasPersisted`
    is true — tells the user their previous work was recovered

### 🎨 Client — Commit 2/2

#### Utils
- **`formatters.js`** (`client/src/utils/formatters.js`) — centralized
  formatting utilities that replace scattered, inconsistent formatting code
  across 10+ files:

  **Problem**: Currency and date formatting had no single source of truth:
  - `৳{val.toLocaleString()}` — no locale, no null guard → "৳undefined"
  - `${val.toLocaleString('en-US')}` — USD symbol + US locale (wrong currency)
  - `/mo` vs `/month` vs `/Month` — inconsistent rent period suffix
  - `new Date(x).toLocaleDateString()` — browser locale → different output on
    each user's device/region
  - No `null`/`undefined` guards anywhere → renders "৳NaN" or crashes

  **Exports**:

  | Function | Input | Output |
  |---|---|---|
  | `formatCurrency(15000)` | 15000 | "৳15,000" |
  | `formatCurrency(null)` | null | "Price on request" |
  | `formatRent(15000)` | 15000 | "৳15,000/mo" |
  | `formatDate('2026-08-31')` | ISO string | "Aug 31, 2026" |
  | `formatDate(x, 'long')` | | "August 31, 2026" |
  | `formatDate(x, 'datetime')` | | "Aug 31, 2026, 2:40 PM" |
  | `formatRelativeTime(date)` | 1h ago | "1 hour ago" |
  | `formatRelativeTime(date)` | 3d ago | "3 days ago" |
  | `formatNumber(1234567)` | | "1,234,567" |
  | `formatNumber(1200, 'compact')` | | "1.2K" |
  | `truncate(text, 80)` | long string | "first 80 chars…" |
  | `capitalise('hello')` | | "Hello" |

  Uses `Intl.RelativeTimeFormat` and `Intl.NumberFormat` where available,
  with manual fallbacks for older browsers.

#### Components Updated
- **`PropertyCard.jsx`** — first adopter of `formatters.js`:
  - Price badge: `৳{val.toLocaleString()}/mo` → `formatRent(val)` (null-safe)
  - "Listed" date: `new Date(x).toLocaleDateString()` → `formatRelativeTime(x)`,
    now shows "2 days ago" instead of "8/29/2026" — much more scannable for users

---

## [2.19.0] - 2026-08-30



### ⚡ Performance — Commit 1/2

#### Hooks
- **`useImageLazyLoad` hook** (`client/src/hooks/useImageLazyLoad.js`) —
  Defers image loading until the element scrolls near the viewport:

  **Problem**: Every `PropertyCard` renders `<img src={url}>` eagerly. On a
  Search results page with 20 listings, all 20 high-resolution images download
  simultaneously on load. On mobile (3G/4G), this causes:
  - 3–5× more bandwidth used on page load than necessary
  - LCP (Largest Contentful Paint) degraded by competing image downloads
  - Images below the fold the user never sees are still fully downloaded

  **Solution**: `useImageLazyLoad(src, options)` uses `IntersectionObserver`
  to swap a 1-byte transparent placeholder for the real image URL only when the
  card enters the viewport (+ `rootMargin` buffer ahead of time):

  1. Card renders with `src` = tiny 1×1 transparent data URI (no network request)
  2. When card enters viewport − `rootMargin`, observer fires, real `src` is set
  3. Browser fetches and renders the image
  4. Observer disconnects (no more work after first visibility)

  Returns:
  - `ref` — attach to `<img>` element
  - `currentSrc` — placeholder → real URL (set this as `<img src={currentSrc}>`)
  - `isLoaded` — true once image has finished loading (drive opacity transitions)
  - `isInView` — true once element entered viewport
  - `hasError` — true if image failed to load (show fallback UI)
  - `enabled` option — set `false` for above-the-fold/hero images (keeps eager loading)

  Gracefully degrades in browsers without `IntersectionObserver` (treats all
  images as immediately visible — same as before).

#### Components Updated
- **`PropertyCard.jsx`** — integrated `useImageLazyLoad`:
  - Removed manual `imageLoaded` and `imageError` `useState` declarations
  - Removed `onLoad`/`onError` handler callbacks from `<img>`
  - Added `ref={imgRef}` and `src={imageSrc}` from the hook
  - `rootMargin: '300px'` — starts loading 300px before card is visible
    to ensure no visible "pop-in" as user scrolls
  - Added `transition-opacity` to the existing `className` for smooth fade-in
  - Net result: 0 images loaded below the fold on initial page render

### 🔍 Server — Commit 2/2

#### Middleware
- **`requestId` middleware** (`server/middleware/requestId.js`) — assigns a
  UUID v4 to every HTTP request for distributed tracing and log correlation:

  **Problem**: Server logs show repeated identical lines with no way to tell which
  log lines belong to the same request:
  ```
  [ERROR] POST /server/auth/signin — 500
  [ERROR] POST /server/auth/signin — 401
  ```
  When a user reports an error and gives you a timestamp, you still can't isolate
  their specific request from dozens of concurrent requests in the logs.

  **Solution**: Every request now gets a unique ID:
  ```
  [req:f47ac10] POST /server/auth/signin 200 43ms
  [req:f47ac10] ValidationError: email is required
  ```
  All log lines for the same request share the same ID. Finding a specific
  failing request is now `grep "req:f47ac10" server.log`.

  - Uses `crypto.randomUUID()` — cryptographically random, zero dependencies
  - Reuses `X-Request-Id` header from upstream (load balancer / API gateway)
    if present — preserving trace IDs across service boundaries
  - Validates incoming header with regex to prevent injection attacks
  - Attaches to `req.id` for downstream controllers to include in their logs
  - Sets `X-Request-Id` response header so the frontend can display a reference
    ID in error toasts: `"Something went wrong (Ref: f47ac10b)"`

#### Utils Updated
- **`requestLogger.js`** — now includes `[req:xxxxxxxx]` prefix in each log line:
  - Before: `[2026-08-30T00:30:00Z] POST /server/listing/get 500 12ms 127.0.0.1`
  - After: `[req:f47ac10b] [2026-08-30T00:30:00Z] POST /server/listing/get 500 12ms 127.0.0.1`
  - Only displayed when `req.id` is set (graceful — won't break if `requestId`
    middleware is ever removed)
  - First 8 chars of UUID shown (enough to be unique, compact in terminal)

---

## [2.18.0] - 2026-08-29



### ✨ Added — Commit 1/2

#### Hooks
- **`useShare` hook** (`client/src/hooks/useShare.js`) — mobile-first sharing
  with automatic fallback chain:

  **Problem**: The `PropertyCard` share button only copied to clipboard via
  `useClipboard`. On smartphones, native share sheets (WhatsApp, SMS, email,
  AirDrop) are far more useful than clipboard copy — but weren't used.
  The existing code also had a duplicate manual `navigator.share` implementation
  inside `handleShare` that bypassed `useClipboard` entirely.

  **Solution**: `useShare` provides a clean three-tier share strategy:

  1. **Web Share API** (`navigator.share`) — fires native OS share sheet on
     mobile and modern Chrome/Edge desktop. ~95% mobile support as of 2026.
  2. **Clipboard API** (`navigator.clipboard.writeText`) — silent copy on
     browsers that support it but not Web Share.
  3. **Legacy `execCommand('copy')`** — last resort for very old browsers.

  Returns:
  - `share(shareData)` — call with `{ title, text, url }`
  - `status` — `'idle' | 'shared' | 'copied' | 'error'`
  - `isShared` — true immediately after any successful share/copy (drives UI)
  - `canShare` — true when Web Share API is available (use to show different icon)
  - `errorMsg` — descriptive error message if all methods fail

  `AbortError` (user dismissed the native sheet) is silently swallowed — no
  clipboard fallback triggered, status stays `idle` — matching user intent.

#### Components Updated
- **`PropertyCard.jsx`** — upgraded share button to use `useShare`:
  - Replaced `useClipboard` import with `useShare`
  - Removed 15-line manual `navigator.share` try/catch in `handleShare` —
    replaced with 6-line clean hook call
  - Tooltip now shows `"Share via apps"` when Web Share API is available,
    `"Copy link"` on desktop — adapts to the device
  - Feedback tooltip shows `"Shared!"` vs `"Copied!"` depending on method used

### 🔒 Server — Commit 2/2

#### Middleware
- **`globalErrorHandler` middleware** (`server/middleware/globalErrorHandler.js`) —
  replaces the 9-line inline error handler in `server/index.js` with a structured,
  classified middleware:

  **Problem**: The inline handler returned `500` for every error regardless of type:
  - Mongoose `ValidationError` → 500 with raw Mongoose message
  - Mongoose `CastError` (bad ObjectId) → 500 with confusing Mongoose message
  - MongoDB duplicate key (E11000) → 500 leaking collection/index names to client
  - JWT `JsonWebTokenError` / `TokenExpiredError` → 500 instead of proper 401
  - JSON parse errors → 500 instead of 400

  **Solution**: Each error class gets its own handler:

  | Error type | Status | Client message |
  |---|---|---|
  | Custom `errorHandler()` | as-set | `err.message` (already safe) |
  | Mongoose `ValidationError` | 422 | field-level validation messages array |
  | Mongoose `CastError` | 400 | "Invalid X: value is not a valid ID format" |
  | MongoDB E11000 (duplicate) | 409 | "Email already exists" |
  | `JsonWebTokenError` | 401 | "Invalid authentication token" |
  | `TokenExpiredError` | 401 | "Token has expired. Please sign in again" |
  | JSON `SyntaxError` body | 400 | "Invalid JSON in request body" |
  | Everything else (prod) | 500 | "An unexpected error occurred" |
  | Everything else (dev) | 500 | `err.message` + `stack` in response |

  - MongoDB/Mongoose internals (collection names, index keys) never exposed to client
  - Stack traces logged server-side always; sent to client only in development
  - `AbortError` / `ENOENT` / `EPIPE` classified as 500 with generic message
  - Consistent envelope: `{ success, statusCode, message, errors?, timestamp }`

---

## [2.17.0] - 2026-08-28



### ✨ Added

#### Hooks — Commit 1/2

- **`useThrottle` hook** (`client/src/hooks/useThrottle.js`) — two exports:

  **`useThrottle(value, interval)`** — value-based throttle:
  - Returns a throttled version of `value` that updates at most once per `interval` ms
  - Updates immediately on the first change, then rate-limits subsequent changes
  - Schedules a trailing update when the last change arrives mid-interval
  - Correct `setTimeout` cleanup on unmount and on rapid value changes

  **`useThrottleCallback(callback, interval, deps)`** — callback throttle:
  - Returns a stable throttled version of a function (like `useCallback` but throttled)
  - Fires immediately on first call, queues trailing call for rapid invocations
  - `deps` array like `useCallback` — memoises correctly
  - Cleans up pending `setTimeout` on unmount

  **When to use throttle vs debounce** (both now in the codebase):

  | Hook | Fires | Best for |
  |---|---|---|
  | `useDebounce` | AFTER user stops changing | Search input, form validation |
  | `useThrottle` | IMMEDIATELY then at most 1× per interval | Scroll, resize, mouse move, button spam guard |

  4 JSDoc examples each: scroll position, window resize, search suggestions,
  geolocation watch; and for callback: button double-submit guard, analytics tracking.

#### Hooks Updated

- **`useStickyHeader`** — integrated `useThrottle` for the `scrollY` return value:
  - Added `throttleMs` option (default `80`ms ≈ 12fps)
  - Internal raw scroll position is still captured via `requestAnimationFrame` (immediate)
  - The throttled `scrollY` return value is rate-limited for consumers
  - **Result**: components consuming `scrollY` re-render ~12×/s instead of ~60×/s on fast scroll
    with zero perceptible difference in the sticky header transition
  - Added 4th JSDoc example showing `throttleMs: 16` for high-frequency parallax use-case

#### SEO — Commit 2/2 — `usePageTitle` applied to all remaining pages

Previously only 4 of 20 pages set a dynamic `<title>` tag. The remaining 16 tabs
showed the generic app-wide title in the browser. Applied `usePageTitle` to 8
high-traffic pages:

| Page | Title set |
|---|---|
| `SignIn.jsx` | `"Sign In"` or `"Admin Sign In"` (dynamic, based on mode) |
| `SignUp.jsx` | `"Create Account"` |
| `Dashboard.jsx` | `"My Dashboard"` or `"Admin Dashboard"` (dynamic, based on role) |
| `ForgotPassword.jsx` | `"Forgot Password"` |
| `ResetPassword.jsx` | `"Reset Password"` |
| `Messages.jsx` | `"Messages"` |
| `Notifications.jsx` | `"Notifications"` |
| `Inquiries.jsx` | `"Inquiries"` |
| `Applications.jsx` | `"My Applications"` |

All titles are appended with ` | Basha Lagbe` by the `usePageTitle` hook.
This improves:
- **Browser UX**: users with many tabs open can identify the app tab quickly
- **SEO**: unique `<title>` per page is one of the highest-impact on-page SEO factors
- **Screen readers**: announce the page title on navigation for accessibility

---

## [2.16.0] - 2026-08-27



### ✨ Added

#### Hooks
- **`useCrossTabSync` hook** (`client/src/hooks/useCrossTabSync.js`) —
  Keeps Redux authentication state in sync across multiple browser tabs:

  **Problem**: redux-persist stores auth state in `localStorage["persist:root"]`.
  When Tab A signs out, it updates localStorage — but Tab B's in-memory Redux
  state is untouched. Tab B still shows the user as logged in, still renders
  their dashboard, and still makes authenticated requests — until a page refresh.
  The reverse is also true: logging in on Tab B doesn't update Tab A's UI.

  **Solution**: The browser fires a native `storage` event on all OTHER tabs
  whenever localStorage changes. The hook listens to this event, reads the new
  `persist:root` value, and dispatches the appropriate Redux action:

  | Event | Hook Response |
  |---|---|
  | Tab A **signs out** | Tab B dispatches `signOutUserSuccess` + navigates to `/sign-in` |
  | Tab A **signs in** | Tab B dispatches `signInSuccess(user)` — no redirect |
  | Tab A **updates profile** | Tab B dispatches `signInSuccess(updatedUser)` — avatar/name in sync |
  | `localStorage` cleared entirely | Tab B dispatches `signOutUserSuccess` + navigates to `/sign-in` |

  - Handles redux-persist's double-serialised JSON format (`persist:root` →
    parse → `.user` → parse → `.currentUser`)
  - Silent `try/catch` on parse errors — malformed storage never crashes the app
  - Clean `removeEventListener` on unmount — no memory leaks
  - Only reacts to `event.key === 'persist:root'` — ignores all other
    localStorage writes for efficiency
  - 3 usage examples in JSDoc, plus limitations (same-origin only, does not
    fire in the writing tab — both are browser constraints, not hook limitations)

#### App Architecture (Updated)
- **`App.jsx`** — extracted `AppRoutes` inner component:
  - `useCrossTabSync` requires `useNavigate` which needs `BrowserRouter` context
  - Standard React pattern: `App` renders `<BrowserRouter><AppRoutes /></BrowserRouter>`
    and `AppRoutes` (inside the router) calls all router-dependent hooks
  - All routes and UI are identical — this is a structural refactor only
  - `useNavigate` import added

---

## [2.15.0] - 2026-08-26


### 🔒 Security — Fail-Fast Environment Validation

- **`validateEnv` startup utility** (`server/utils/validateEnv.js`) —
  Validates all required environment variables **before any server setup runs**,
  crashing immediately with a clear error if secrets are missing or weak:

  **Problem**: The server had a hardcoded JWT_SECRET fallback in `verifyUser.js`:
  ```js
  const JWT_SECRET = process.env.JWT_SECRET || 'BashaLagbe2025SuperSecretKeyAdvancedSecurityProductionReady147258369';
  ```
  If `JWT_SECRET` is not set in a deployment, the app silently uses this hardcoded
  string. Anyone who reads the source code on GitHub can forge valid JWTs, bypass
  authentication, and take over any user account. The app must REFUSE TO START.

  **Solution — Fail-fast principle**:
  - `validateEnv()` is called in `server/index.js` immediately after `dotenv.config()`
    and before `const app = express()` — nothing runs if env is invalid
  - **`JWT_SECRET`** — required, minimum **32 characters** (NIST HMAC-SHA256 minimum)
  - **`MONGO_URL`** — required, minimum 10 characters
  - **`NODE_ENV`** — required, must be one of `development | production | test`
  - **`EMAIL_USER`** / **`EMAIL_PASS`** — warnings in dev, hard errors in production
  - **`ALLOWED_ORIGINS`** — warning in production if unset (CORS fallback to localhost)
  - On failure: prints a boxed error table listing every issue, then calls
    `process.exit(1)` — deployment systems (Render, Railway, Heroku) detect the
    non-zero exit and mark the deployment as failed
  - On success: logs `✅  Environment validated (5 variables checked)`

- **`verifyUser.js`** — removed hardcoded `JWT_SECRET` fallback:
  - Old: `process.env.JWT_SECRET || 'BashaLagbe2025...'`
  - New: `process.env.JWT_SECRET` — no fallback, intentionally
  - Comment explains that `validateEnv()` guarantees the variable exists before
    any request can reach `verifyToken`; the fallback was a false safety net

---

## [2.14.0] - 2026-08-25


### ♿ Accessibility

#### Hooks
- **`useFocusReturn` hook** (`client/src/hooks/useFocusReturn.js`) —
  Manages keyboard focus for modals, drawers, sidebars, and any transient UI:

  **Problem**: When a modal opens, keyboard users expect two things:
  1. Focus moves INTO the modal (so they can immediately Tab through its buttons)
  2. Focus RETURNS to the triggering element when the modal closes

  Without this, focus is "lost" — it lands on the document body or stays on a
  button that no longer makes sense in context, making the app near-unusable
  for keyboard-only users. This is a WCAG 2.1 SC 2.4.3 (Focus Order) violation.

  **Solution**:
  - `containerRef` — attach to the modal/drawer container; hook queries within it
  - On `isOpen` → `true`: captures `document.activeElement` as the "trigger", then
    after `delay` ms focuses the first element matching `focusSelector` inside the
    container (or makes the container itself focusable as a fallback)
  - On `isOpen` → `false`: restores focus to the previously captured trigger element
  - `focusFirst()` — imperative handle to re-focus after async content loads
  - `returnFocusToTrigger()` — imperative handle for custom close logic
  - **Options**:
    - `focusSelector` — CSS selector for the first element to focus (default:
      all standard focusable elements; override with e.g. `'[data-autofocus]'`)
    - `delay: 50` — ms before focusing (lets entrance transitions begin first)
    - `returnFocus: true` — set false when the trigger element itself is removed
  - 4 JSDoc usage examples: modal, drawer with custom selector, imperative after
    async load, disabled return focus
  - Directly implements WCAG 2.1 SC 2.4.3 and ARIA `dialog` pattern spec

#### Components (Updated)
- **`ConfirmDialog.jsx`** — upgraded from manual `setTimeout` focus to `useFocusReturn`:
  - Removed `useRef(null)` + `setTimeout(() => confirmBtnRef.current?.focus(), 50)`
  - Now uses `const { containerRef } = useFocusReturn(isOpen, { focusSelector: '[data-confirm-dialog-btn]' })`
  - `containerRef` attached to the outermost dialog `<motion.div>`
  - `focusSelector: '[data-confirm-dialog-btn]'` targets Cancel/Confirm buttons specifically
  - `delay: 60` — slightly longer than default to avoid focus race with Framer Motion
  - When the dialog closes, focus now properly returns to whatever button opened it
    (e.g. "Delete Listing" button) instead of being lost on the document body
  - `useEffect` body for scroll-lock simplified from 7 lines to 1 (ternary)
  - Scroll-lock and focus management are now fully separate concerns

---

## [2.13.0] - 2026-08-24


### ✨ Added

#### Server Utilities
- **`responseFormatter` utility** (`server/utils/responseFormatter.js`) —
  Standardises all HTTP API response shapes across the server:

  **Problem**: A codebase audit found 38+ `res.status(200).json(...)` calls
  across all controllers returning inconsistent shapes — some `{ success, user }`,
  some `{ success, data }`, some raw arrays, one plain unwrapped object. The
  frontend's `apiService.js` must defensively branch on every response.

  **Solution**: Three exported functions, all producing a predictable envelope:

  - **`sendSuccess(res, data, message, statusCode)`**
    ```json
    { "success": true, "statusCode": 200, "message": "...", "data": {...}, "timestamp": "..." }
    ```
    - `data: null` and `statusCode: 204` → sends `204 No Content` (empty body)
    - Omits the `data` key entirely when `null` (no empty `"data": null`)

  - **`sendPaginated(res, items, { page, limit, total }, message)`**
    ```json
    { "success": true, "data": [...], "pagination": { "page", "limit", "total", "totalPages", "hasNextPage", "hasPrevPage" } }
    ```
    - Derived fields (`totalPages`, `hasNextPage`, `hasPrevPage`) calculated automatically

  - **`sendError(res, message, statusCode, errors)`**
    ```json
    { "success": false, "statusCode": 400, "message": "...", "errors": [...], "timestamp": "..." }
    ```
    - `errors[]` is only included when non-empty
    - Prefer throwing via `errorHandler` for most cases; this is for direct sends

  - All three include an ISO 8601 `timestamp` for logging/debugging
  - Comprehensive JSDoc with usage examples

#### Controllers (Updated)
- **`user.controller.js`** — fully migrated to `responseFormatter`:
  - `getUserProfile` → `sendSuccess(res, { user, stats }, '...')`
  - `updateUserProfile` → `sendSuccess(res, { user }, '...')`
  - `uploadAvatar` → `sendSuccess(res, { user }, '...')`
  - `changeEmail` → `sendSuccess(res, { user }, '...')`
  - `changePassword` → `sendSuccess(res, null, '...')` (no data needed)
  - `deleteUserAccount` → `sendSuccess(res, null, '...')` (no data needed)
  - `getUser` → was returning raw unwrapped object; now wrapped properly

---

## [2.12.0] - 2026-08-23


### 🔒 Security — Critical Fix

**Replace `Math.random()` with Node.js `crypto` CSPRNG for all security tokens**

A security audit of the server codebase found 3 instances where `Math.random()`
was used to generate security-sensitive values. `Math.random()` is a deterministic
pseudorandom number generator (PRNG) — it is **NOT cryptographically secure** and
must not be used for passwords, OTPs, or any security token:

- Its internal state can be predicted if an attacker observes enough outputs
- It does not use OS entropy (`/dev/urandom` or `CryptGenRandom`)
- NIST SP 800-90A, OWASP, and the Node.js Security team all advise against it
  for security-sensitive values

**Files changed:**

#### `server/utils/emailService.js`
- **Before**: `Math.floor(100000 + Math.random() * 900000).toString()`
- **After**: `crypto.randomInt(100_000, 1_000_000).toString()`
- `crypto.randomInt(min, max)` is a purpose-built CSPRNG for integers
- Uniform distribution across the full `[100000, 999999]` range with
  no modulo bias (unlike `Math.random()` scaled by multiplication)
- Detailed JSDoc comment explains why `Math.random()` is wrong here,
  with references to NIST SP 800-90A and OWASP

#### `server/controllers/auth.controller.js` (2 locations)
- **Before**: `Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)`
  — this produces only ~47 bits of entropy at best (two base-36 8-char strings)
- **After**: `crypto.randomBytes(24).toString('base64url')`
  — 24 bytes = **192 bits** of cryptographic entropy — unguessable
- Applied to both the **Google OAuth** and **GitHub OAuth** new-user password
  generation paths
- `base64url` encoding produces a URL-safe string usable anywhere a password is

**Why this matters for Basha Lagbe specifically:**
OTPs that use `Math.random()` can be predicted by an attacker who can observe
the server's PRNG output over time (via timing attacks or repeated sampling).
If the OTP for email verification is predictable, an attacker can verify an
account they don't control and take it over.

---

## [2.11.0] - 2026-08-22


### ✨ Added

#### Hooks
- **`useGeolocation` hook** (`client/src/hooks/useGeolocation.js`) —
  Wraps the browser Geolocation API with full React state management:
  - Returns `{ coordinates, loading, error, isSupported, isPermissionDenied, getLocation, clearLocation }`
  - `coordinates` — full `GeolocationCoordinates` object with `latitude`,
    `longitude`, `accuracy`, `altitude`, `heading`, `speed`
  - `loading` — true while a position request is in-flight
  - `error` — human-readable string (permission denied, timeout, unavailable)
  - `isPermissionDenied` — separate boolean so the UI can hide the button
    rather than showing a confusing error when the user has refused
  - `isSupported` — false on browsers without Geolocation API
  - `getLocation()` — triggers a one-shot `getCurrentPosition` request
  - `clearLocation()` — resets all state back to initial values
  - **`immediate: true`** option — fetches on mount automatically
  - **`watch: true`** option — uses `watchPosition` for live tracking
    (with `clearWatch` cleanup on unmount)
  - **`enableHighAccuracy: false`** option (default) — conserves battery;
    set true for GPS-level accuracy on live map features
  - **`timeout: 10000`** — request times out after 10 seconds
  - **`maximumAge: 60000`** — accepts cached positions up to 1 minute old
    (avoids repeated GPS lookups for the same session)
  - `onSuccess` and `onError` are stable `useCallback` references
  - 4 usage examples in JSDoc: Near Me button, auto-detect on mount,
    live tracking, conditional UI based on support/permission

#### Pages (Updated)
- **`Search.jsx`** — adds "📍 Near Me" button to the search bar:
  - Wires `useGeolocation` and renders a Near Me button between Filters
    and Search buttons in the sticky search header
  - Button only renders when `isSupported && !isPermissionDenied` —
    hidden automatically on Safari-without-permission or Firefox private mode
  - Shows **"Detecting..."** with disabled state while fetching
  - Turns **green with ✓ checkmark** once coordinates are acquired
  - On success, `coordinates.latitude/longitude` are available for
    proximity-based filtering in future iterations
  - Tooltip shows exact coordinates on hover when detected
  - Error message (e.g. "Location permission denied") shown inline in red
    below the button row if geolocation fails

---

## [2.10.0] - 2026-08-19


### 🔒 Security / Configuration

- **`corsOptions` middleware** (`server/middleware/corsOptions.js`) —
  Replaces the hardcoded CORS origin list in `server/index.js` with an
  environment-variable–driven, dynamically validated configuration:

  **Problem with the previous approach**:
  - `origin: ['http://localhost:5173', 'http://localhost:5174']` is hardcoded
  - In production, all browser requests fail with CORS errors because the
    real frontend domain is not in the list
  - Updating the list requires a code change + redeploy

  **Solution**:
  - Reads `ALLOWED_ORIGINS` from `.env` as a comma-separated string
  - Falls back to `localhost:5173` and `localhost:5174` when the variable
    is not set (zero config needed for local development)
  - Uses a **dynamic origin validator function** (not a static array) — each
    request's `Origin` header is checked individually with a descriptive
    rejection message visible in browser DevTools
  - Requests with no `Origin` header (server-to-server, curl, Postman) are
    allowed through — they are not cross-origin browser requests
  - `credentials: true` — cookies and Authorization headers pass through
  - `methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']` — explicit allowlist
  - `allowedHeaders` — locked to `Content-Type`, `Authorization`,
    `X-Requested-With`, `Accept`
  - `exposedHeaders` — exposes `X-RateLimit-Limit`, `X-RateLimit-Remaining`,
    `X-RateLimit-Reset`, `Retry-After` (added by `rateLimitByUser`)
  - `maxAge: 3600` — browsers cache the preflight (OPTIONS) response for
    1 hour, eliminating repeated OPTIONS round trips
  - Logs resolved origins once at startup: `🌐 CORS: 2 allowed origin(s): ...`
  - Wired into `server/index.js` replacing the inline `cors({...})` call
  - `.env` updated with commented `ALLOWED_ORIGINS` example for production

---

## [2.9.0] - 2026-08-18


### ✨ Added

#### Hooks
- **`useNetworkSpeed` hook** (`client/src/hooks/useNetworkSpeed.js`) —
  Reads the browser's Network Information API to expose connection quality:
  - Returns `{ effectiveType, downlink, rtt, saveData, isSlowConnection, isSupported }`
  - `effectiveType`: `'slow-2g' | '2g' | '3g' | '4g' | 'unknown'`
  - `downlink`: estimated bandwidth in Mbps (`null` when unsupported)
  - `rtt`: round-trip time in milliseconds (`null` when unsupported)
  - `saveData`: `true` when user has enabled browser/OS Data Saver mode
  - `isSlowConnection`: convenience boolean — `true` on `slow-2g`/`2g` or
    when `saveData` is on; use as the primary conditional in components
  - `isSupported`: `false` on Safari/Firefox (graceful degradation)
  - Listens to the connection's `'change'` event via `useEventListener`
    for live updates as the user moves between WiFi and mobile data
  - Also re-reads on `visibilitychange` (connection may change while tab
    was in background)
  - Returns safe `isSlowConnection: false, effectiveType: 'unknown'`
    defaults on unsupported browsers — zero crashes
  - 4 usage examples in JSDoc: lower-quality images, disable animations,
    show connection badge, respect Data Saver

#### Components (Updated)
- **`OfflineBanner`** — upgraded from offline-only to full network quality banner:
  - Imports `useNetworkSpeed` alongside existing `useOnlineStatus`
  - **Priority**: offline (orange) → slow/Data-Saver (blue) → nothing
  - Slow connection banner shows the actual `effectiveType` (e.g. `"2G"`)
    or a special "Data Saver mode is on" message when `saveData` is true
  - Both banners use the existing Framer Motion slide-down animation
  - `SignalIcon` used for slow-net banner; `ExclamationTriangleIcon` for offline
  - `aria-live="assertive"` on both for screen reader announcements

---

## [2.8.0] - 2026-08-17


### ✨ Added

#### Hooks
- **`useKeyPress` hook** (`client/src/hooks/useKeyPress.js`) —
  Declarative hook for detecting specific keyboard key presses:
  - Returns `isPressed: boolean` — true while the target key is held down,
    false on key release (enables visual held-key feedback in UI)
  - Accepts a **single key string** or an **array of keys** to match any
    of multiple keys (e.g. `['ArrowUp', 'ArrowDown']`)
  - `onKeyDown` callback fires once per keydown event on the matched key
  - `onKeyUp` callback fires once per keyup event on the matched key
  - **Modifier support**: `ctrl`, `shift`, `alt` options — each defaults
    to false; `ctrl` also matches `event.metaKey` (Cmd on Mac)
  - `enabled` flag — set to false to pause the listener without unmounting
    (resets `isPressed` to false automatically)
  - `element` option — attach to a specific DOM element instead of `window`
  - Built on `useEventListener` — zero manual `addEventListener` calls,
    all cleanup guaranteed
  - `handleKeyDown` and `handleKeyUp` are stable `useCallback` references —
    no unnecessary re-registrations on each render
  - 5 usage examples in JSDoc: Escape, Ctrl+K shortcut, arrow navigation,
    held-key visual feedback, disabled when modal open

#### Components (Updated)
- **`ConfirmDialog`** — upgraded Escape key handler:
  - Replaces the manual `useEventListener('keydown', ...)` with `useKeyPress`
  - Now uses `useKeyPress('Escape', { enabled: isOpen, onKeyDown: onClose })`
  - Bonus fix: Escape is now correctly **disabled while `loading=true`**
    (previous implementation would close the dialog mid-API-call)

---

## [2.7.0] - 2026-08-16


### 🔒 Security

- **`rateLimitByUser` middleware** (`server/middleware/rateLimitByUser.js`) —
  Per-authenticated-user rate limiter complementing the existing IP-based limit:
  - **Why IP alone is not enough**: shared networks (university, office, mobile
    carrier NAT) mean many users share one public IP. A single heavy user or
    bot on the same network can exhaust the IP quota, blocking innocent users.
    Authenticated endpoints already have a verified identity via JWT — use it.
  - Extracts the user key from `req.user.id` (set by `verifyToken`); falls
    back to `req.ip` for anonymous/unauthenticated requests automatically
  - Uses an in-memory `Map<string, { count, resetAt }>` store — no Redis
    dependency needed; works out of the box
  - Periodic cleanup interval (runs every `windowMs`) evicts expired buckets,
    preventing unbounded memory growth in long-running processes
  - `cleanupInterval.unref()` allows Node to exit cleanly even if the interval
    is still scheduled
  - Sets standard HTTP rate-limit headers on **every** response:
    - `X-RateLimit-Limit` — configured maximum
    - `X-RateLimit-Remaining` — requests left in current window
    - `X-RateLimit-Reset` — Unix timestamp of window reset
    - `Retry-After` — seconds until retry (only on 429 responses)
  - Returns `429 Too Many Requests` via `errorHandler` (consistent with all
    other server error responses)
  - Accepts `{ windowMs, max, message }` options for per-route tuning
  - **Wired into `server/index.js`** on three route groups:
    - `/server/user`    → `rateLimitByUser({ max: 60 })` — 60 req/min per user
    - `/server/listing` → `rateLimitByUser({ max: 60 })` — 60 req/min per user
    - `/server/review`  → `rateLimitByUser({ max: 30 })` — stricter for reviews
  - Works alongside (not replacing) the existing `express-rate-limit` IP limiter
  - 3 usage examples in JSDoc (global, per-route strict, custom window)

---

## [2.6.0] - 2026-08-15


### ✨ Added

#### Server Middleware
- **`cacheControl` middleware** (`server/middleware/cacheControl.js`) —
  Sets HTTP `Cache-Control` response headers automatically based on route:
  - `/server/listing/get/:id` → `public, max-age=60, s-maxage=300, stale-while-revalidate=600`
    (1 min browser / 5 min CDN / serve stale for 10 min while revalidating)
  - `/server/listing/get` and `/search` → `public, max-age=30, s-maxage=120`
    (30s browser / 2 min CDN — listing lists change more often than single items)
  - `/server/admin/stats` → `public, max-age=60, s-maxage=300`
    (dashboard stats can be short-lived public cache)
  - `/server/auth/**` and `/server/user/**` → `private, no-store, must-revalidate`
    (security-sensitive, never cached in any shared store)
  - `/server/health` → `no-store` (monitoring tools always need live responses)
  - All other routes → `private, no-cache` (validate before use)
  - Wired into `server/index.js` after `sanitizeInput`, before static files
  - `stale-while-revalidate` on listings: browser uses cached version
    immediately while fetching a fresh one in the background (zero latency UX)

#### Hooks
- **`usePageTitle` hook** (`client/src/hooks/usePageTitle.js`) —
  Dynamically updates `document.title` per page with automatic restoration:
  - Appends ` | Basha Lagbe` suffix automatically (configurable `siteName`)
  - `raw: true` option uses the title as-is (for landing/marketing pages)
  - Captures the previous title in a `useRef` and restores it on unmount
    (`restoreOnUnmount: false` available to opt out)
  - Handles empty/null titles gracefully (falls back to site name only)
  - 4 usage examples in JSDoc
  - **Applied to 4 pages**:
    - `Home.jsx` → `"Find Rental Properties in Bangladesh | Basha Lagbe"`
    - `Search.jsx` → `"Search Properties | Basha Lagbe"`
    - `Profile.jsx` → `"My Profile | Basha Lagbe"`
    - `Landing.jsx` → `"Welcome to Basha Lagbe — Find Your Perfect Home"` (raw)

---

## [2.5.0] - 2026-08-14


### ✨ Added

#### Hooks
- **`useIdleTimer` hook** (`client/src/hooks/useIdleTimer.js`) —
  Detects user inactivity after a configurable timeout:
  - Monitors 7 passive window events: `mousemove`, `mousedown`, `keydown`,
    `touchstart`, `scroll`, `wheel`, `visibilitychange`
  - All event listeners attached via `useEventListener` (zero boilerplate,
    guaranteed cleanup)
  - `onIdle` callback fires once when user goes idle (guarded by ref to
    prevent double-firing)
  - `onActive` callback fires once when user returns from idle
  - `enabled` flag — set to false to pause the timer (e.g. while a modal
    is open), safely restores active state
  - Exposes `reset()` and `activate()` for programmatic control after
    API calls or form saves
  - Callbacks stored in refs — always fresh, never stale closures
  - Default timeout: 5 minutes (configurable)
  - 3 usage examples in JSDoc: session warning, auto-save draft, pause video
  - Key use case: AddProperty multi-step form auto-save draft on idle

#### Components
- **`EmptyState` component** (`client/src/components/EmptyState.jsx`) —
  A reusable, animated empty-state display that standardises "no results"
  states across all pages:
  - **3 icon types**: emoji string (e.g. `"🔍"`), Heroicon component
    (e.g. `MagnifyingGlassIcon`), or image URL — all handled automatically
  - **3 sizes**: `sm` `md` `lg` — each with matched padding, icon size,
    title size, and button size
  - Optional CTA button with `primary` (blue) and `outline` (gray) variants
  - Framer Motion fade-in + slide-up on mount
  - PropTypes validated on all props
  - 4 usage examples in JSDoc: no results, no saved properties, empty
    notifications (no button), Heroicon as icon
  - **Integrated into `Search.jsx`**: replaces the 11-line ad-hoc div
    with `<EmptyState icon={MagnifyingGlassIcon} title="No Properties Found" ... />`

---

## [2.4.0] - 2026-08-13


### ✨ Added

#### Hooks
- **`useEventListener` hook** (`client/src/hooks/useEventListener.js`) —
  Safely attaches DOM event listeners with guaranteed cleanup:
  - Accepts any `EventTarget`: `window`, `document`, a DOM node, or a
    React ref object (`{ current: ... }`) — resolved at effect time
  - Stores the handler in a `useRef` so it's always fresh without
    triggering re-registrations on every render (no stale closure bugs)
  - Forwards `options` to `addEventListener` for passive/capture control
  - Returns void; cleanup runs automatically on unmount or dependency change
  - Null-safe: no-ops if the target doesn't support `addEventListener`
  - 4 usage examples in JSDoc: Escape key, outside-click, passive resize,
    attach to element ref
  - Used internally by `ConfirmDialog` for Escape-key handling

#### Components
- **`ConfirmDialog` component** (`client/src/components/ConfirmDialog.jsx`) —
  An accessible, animated modal that guards destructive actions:
  - **4 intent variants**: `danger` (red), `warning` (amber), `info` (blue),
    `success` (green) — each with matching button, icon colour, and icon
  - **Accessibility**: `role="dialog"`, `aria-modal`, `aria-labelledby`,
    `aria-describedby`, icon `aria-hidden`
  - **Keyboard support**:
    - Escape key closes via `useEventListener` (auto-cleanup guaranteed)
    - Auto-focuses the Confirm button on open (50ms delay for animation)
    - Tab trap cycles focus between Cancel and Confirm only
  - **Body scroll lock**: sets `overflow: hidden` while open; restores on
    close or unmount
  - **Backdrop click** dismisses the dialog (disabled while `loading=true`)
  - **Loading state**: `loading` prop shows a spinner on the confirm button
    and disables both buttons to prevent double-submission
  - Framer Motion backdrop (fade) + panel (scale + slide) animations
  - `max-w-md` responsive — stacks buttons vertically on mobile
  - PropTypes validated on all 9 props
  - 2 usage examples in JSDoc (delete property, sign out with loading state)

---

## [2.3.0] - 2026-08-12


### ✨ Added

#### Hooks
- **`useIntersectionObserver` hook** (`client/src/hooks/useIntersectionObserver.js`) —
  Wraps the native IntersectionObserver API and returns `[ref, isIntersecting, entry]`:
  - Accepts `{ root, rootMargin, threshold, freezeOnceVisible }` options
  - `freezeOnceVisible: true` — observer disconnects after element is seen once,
    ideal for entrance animations that should play only once per page visit
  - Falls back to `isIntersecting: true` in browsers without IO support (IE11)
  - Returns the raw `IntersectionObserverEntry` for advanced usage
    (e.g. `entry.intersectionRatio` for parallax effects)
  - Stable `updateEntry` callback via `useCallback` — no unnecessary re-renders
  - Disconnects observer on unmount and whenever `frozen` becomes true
  - 3 usage examples in JSDoc (entrance animation, infinite scroll sentinel,
    visibility ratio)

#### Components
- **`FadeInSection` component** (`client/src/components/FadeInSection.jsx`) —
  A layout wrapper that slides + fades its children in on scroll:
  - 4 directions: `up` (default) `down` `left` `right`
  - Configurable `delay` (seconds) for staggered multi-section layouts
  - Configurable `duration` (default 0.6s) and `rootMargin` trigger offset
  - Uses `useIntersectionObserver({ freezeOnceVisible: true })` — animation
    plays only once; no "pop in every time you scroll back" effect
  - Framer Motion cubic-bezier easing `[0.22, 1, 0.36, 1]` for natural motion
  - PropTypes validated
  - Integrated into `Home.jsx`:
    - "Explore by Property Type" section heading — slides up on scroll
    - "Featured Properties" section heading — slides up with 0.05s delay
    - Removes two `whileInView` motion.div blocks (replaced by FadeInSection)

---

## [2.2.0] - 2026-08-11


### ✨ Added

#### Hooks
- **`useScrollProgress` hook** (`client/src/hooks/useScrollProgress.js`) —
  Returns how far the user has scrolled down the page as a 0–100 number:
  - Accepts optional `{ target, precision }` options
  - `target`: measure a specific scrollable DOM element instead of the window
  - `precision`: decimal places to round to (default 1)
  - Uses a passive scroll listener + `requestAnimationFrame` guard so the
    handler never blocks the main thread (zero jank on any device)
  - Clamps result to [0, 100] — handles edge cases like zero-height pages
  - Sets initial value on mount for browser-back navigation accuracy
  - 3 usage examples in JSDoc (basic, scrollable div, trigger at 80%)

#### Components
- **`ReadingProgressBar` component** (`client/src/components/ReadingProgressBar.jsx`) —
  A thin gradient bar fixed to the very top of the viewport that fills
  left-to-right as the user scrolls:
  - Uses `useScrollProgress` internally — no props required
  - Framer Motion `scaleX` animation driven by scroll progress value
    with `transformOrigin: left` so it grows from the left edge
  - Blue → purple → pink gradient matching the site colour palette
  - Fades in after 2% scroll to avoid jarring appearance at the very top
  - `height: 3px` — thin but clearly visible
  - `z-[9998]` — sits below OfflineBanner but above all other UI elements
  - `aria-hidden="true"` — decorative, not meaningful to screen readers
  - Wired into `App.jsx` directly after `<OfflineBanner />` so it appears
    on every page of the application

---

## [2.1.0] - 2026-08-10


### ✨ Added

#### Hooks
- **`useToggle` hook** (`client/src/hooks/useToggle.js`) — Returns
  `[state, toggle, setValue]` — a boolean + stable toggle function:
  - `toggle()` flips the value (stable `useCallback` ref — safe in deps arrays)
  - `setValue(bool)` forces an explicit value (e.g. force-close on Escape)
  - Replaces the repeated `const [x, setX] = useState(false)` + manual toggle
    pattern across modals, menus, filter panels, and dropdowns
  - `initialValue` coerced to Boolean to handle non-boolean inputs
  - 4 usage examples in JSDoc (simple, escape key, initial open, multiple)
  - Applied to `Search.jsx` — replaces `[showFilters, setShowFilters]`
    with `[showFilters, toggleFilters]` from the hook

- **`useStickyHeader` hook** (`client/src/hooks/useStickyHeader.js`) — Returns
  `{ isSticky, scrollY }` based on scroll position:
  - Threshold-based: `isSticky` becomes `true` once `scrollY > threshold`
  - Optional `hysteresis` mode — prevents flickering near the threshold
    (stays sticky until user scrolls back to within 10px of top)
  - Uses a **passive** scroll listener to never block the main thread
  - Uses `requestAnimationFrame` guard to batch scroll events (no jank)
  - SSR-safe; runs once on mount to set state for browser-back pages
  - Applied to `Header.jsx` — switches from blue gradient → `bg-white
    shadow-lg` with a `transition-all duration-300` smooth cross-fade

#### Components
- **`Badge` component** (`client/src/components/Badge.jsx`) — A reusable
  pill/chip for status labels, type tags, counts, and category filters:
  - 8 colour variants: `default` `success` `warning` `danger` `info`
    `purple` `orange` `gray` — each with ring, text, and background
  - 3 sizes: `sm` `md` `lg`
  - `dot` prop adds a coloured status dot before the text
  - `rounded` prop switches between pill (`rounded-full`) and chip style
  - `onClick` prop makes the badge interactive: adds `cursor-pointer`,
    `hover:opacity-80`, `role="button"`, `tabIndex`, and keyboard Enter/Space
  - `aria-hidden` on the dot span (decorative)
  - PropTypes validated on all props
  - 5 usage examples in JSDoc

### 🔒 Security
- **Remove all DEBUG `console.log` from `auth.controller.js`** — 14+ debug
  statements removed from `sendVerificationCode`, `completeSignup`, `signin`,
  and `completeSignin` functions:
  - Leaked: user email addresses on every auth request
  - Leaked: plaintext verification codes (e.g. `Code: 123456`)
  - Leaked: internal code comparison results (`Match: false`)
  - Leaked: full verification document contents including expiry timestamps
  - `console.error` calls for genuine errors (email service failures,
    unexpected caught exceptions) are intentionally kept

---

## [2.0.0] - 2026-08-09


### ✨ Added

#### Hooks
- **`useCountdown` hook** (`client/src/hooks/useCountdown.js`) — A reusable
  countdown timer with `start`, `stop`, and `reset` controls:
  - Accepts `{ initialSeconds, autoStart, onComplete }` options
  - Returns `{ count, isRunning, isDone, start, stop, reset }`
  - `onComplete` callback fires when count reaches zero
  - `autoStart: true` starts counting immediately on mount
  - Keeps `onComplete` in a ref to avoid stale closure bugs
  - Cleans up `setTimeout` on unmount and on each `start()` call
  - Integrated into `SignIn.jsx` — replaces the manual `resendTimer` state
    + `useEffect` countdown (5 lines removed from SignIn)

- **`usePrevious` hook** (`client/src/hooks/usePrevious.js`) — Returns the
  value that any state/prop held during the previous render:
  - One-liner pattern: `useRef + useEffect` stored in a single reusable hook
  - Optional `initialValue` for the very first render (defaults to `undefined`)
  - Fully generic (TypeScript JSDoc typed as `T`)
  - Use cases: transition direction detection, undo patterns, comparing before/after
  - Integrated into `Notifications.jsx` to derive `paginationDirection` (1 or -1)
    for animating pagination in the correct direction

#### Components
- **`Tooltip` component** (`client/src/components/Tooltip.jsx`) — An
  accessible, animated tooltip that replaces browser-native `title=""`:
  - Supports `top` / `bottom` / `left` / `right` placement
  - Configurable `delay` prop (default 400ms) — prevents tooltip flicker
  - Framer Motion `AnimatePresence` with directional fade+scale animation
    (`y: ±4` for top/bottom, `x: ±4` for left/right)
  - `role="tooltip"` for screen reader accessibility
  - Shows on `mouseenter` + `focus`, hides on `mouseleave` + `blur`
  - `pointer-events-none` on the bubble so it never interferes with clicks
  - Dark charcoal bubble (`bg-gray-900`) for contrast on any background
  - PropTypes validated; renders `children` directly when `content` is empty
  - 3 usage examples in JSDoc

#### Backend
- **`requestTimeout` middleware** (`server/middleware/requestTimeout.js`) —
  Kills any request that has not received a response within a time limit:
  - Default: `30_000ms` (30 seconds); per-route overridable: `requestTimeout(120_000)`
  - On timeout: destroys the underlying TCP socket immediately to free the port
  - Passes a `503 Service Unavailable` error to the global error handler
  - Sets `req.timedOut = true` so controllers can check if they're still needed
  - Clears the timer on both `res.finish` and `res.close` events
  - Guards against firing after headers are already sent
  - Wired globally in `server/index.js` after the request logger

---

## [1.9.0] - 2026-08-06


### ✨ Added

#### Hooks
- **`useFormValidation` hook** (`client/src/hooks/useFormValidation.js`) — A
  reusable form state + validation hook:
  - Accepts `initialValues` and `validationRules` objects
  - Each rule: `(value, formData) => errorString | ''` — supports cross-field
    validation (e.g. password === confirmPassword)
  - `handleChange`: standard onChange, clears field error live after touch
  - `handleBlur`: validates on field blur (standard UX — errors after leaving)
  - `validateAll()`: runs all rules at once, returns boolean (for onSubmit)
  - `setFieldValue(name, value)`: for custom inputs / date pickers
  - `resetForm()` / `resetErrors()`: full and partial reset
  - `isValid` boolean for disabling submit buttons
  - `isDirty` boolean to guard unsaved-changes warnings
  - Eliminates copy-pasted form state across SignIn, SignUp, ForgotPassword,
    AddProperty, Profile pages

- **`useMediaQuery` hook** (`client/src/hooks/useMediaQuery.js`) — Evaluates
  any CSS media query string and returns a reactive boolean:
  - Uses `window.matchMedia` API with a `MediaQueryList` change listener
  - More flexible than `useWindowSize` — matches any CSS media feature:
    `(prefers-color-scheme: dark)`, `(prefers-reduced-motion: reduce)`,
    arbitrary `min-width`/`max-width` ranges, orientation, etc.
  - Modern `addEventListener('change')` API with `addListener` fallback for
    Safari < 14
  - SSR-safe: returns `false` when `window` is undefined
  - Re-evaluates immediately when the `query` prop changes
  - Documented with 4 usage examples including Tailwind breakpoint equivalents

#### Components
- **`SkeletonCard` component** (`client/src/components/SkeletonCard.jsx`) — A
  shimmer placeholder that matches the `PropertyCard` layout exactly:
  - `ShimmerLine` sub-component: configurable shimmer bar (width/height)
  - `SingleSkeletonCard`: image area + title + location + stats + description
    (description only in `default` variant) + price + action stubs
  - Main `SkeletonCard` export renders `count` cards via `Array.from()`
  - `variant` prop (`default`/`compact`/`minimal`) matches `PropertyCard`
  - `aria-hidden="true"` on each card (purely decorative loading UI)
  - PropTypes validated
  - `@keyframes shimmer` + `.animate-shimmer` utility added to `index.css`
    using `bg-[length:200%_100%]` + `background-position` sweep technique

#### Backend Security & Quality
- **Remove debug logs from `verifyUser.js`** — 4 `console.log('DEBUG:...')`
  statements removed from `verifyToken`:
  - They leaked token existence, JWT secret presence, JWT error messages,
    and decoded `id`/`email`/`role` to server logs on every request
  - Production auth middleware should be silent on success

- **`validatePagination` middleware** (`server/middleware/validatePagination.js`):
  - Parses and sanitises `req.query.page`, `limit`, `sort` before controllers
  - `page`: defaults 1, clamped 1–10 000, NaN → 1
  - `limit`: defaults 12, clamped 1–100, NaN → 12
  - `sort`: validated against allowlist of 7 values; returns 400 on unknown sort
  - Sets `req.pagination = { page, limit, skip, sort, sortRaw }` — controllers
    just destructure instead of doing their own `parseInt`
  - `'relevance'` maps to `{ score: { $meta: 'textScore' } }` for full-text search
  - Wired into `listing.route.js` for `GET /get`, `/all`, and `/search`

---

## [1.8.0] - 2026-08-05


### ✨ Added

#### Hooks & UX
- **`useOnlineStatus` hook** (`client/src/hooks/useOnlineStatus.js`) — Tracks
  browser network connectivity state reactively:
  - Returns `{ isOnline, isOffline, since }` based on `navigator.onLine`
  - Listens to `window.addEventListener('online' | 'offline')` — zero polling
  - `since` is a `Date` object recording when the current status started
    (enables "Offline for X minutes" UI messages)
  - SSR-safe: initialises from `navigator.onLine` when `window` is available
  - Cleans up both event listeners on unmount
  - Documented with JSDoc and two usage examples

- **`OfflineBanner` component** (`client/src/components/OfflineBanner.jsx`) —
  Animated top banner that appears when the user loses network connectivity:
  - Uses `useOnlineStatus` internally — accepts no props
  - `position: fixed top-0 left-0 right-0 z-[9999]` — above all other UI
  - Framer Motion `AnimatePresence`: slides in from `y=-60` on disconnect,
    slides back out on reconnect
  - Amber/orange gradient visually distinct from the blue/indigo site palette
  - Accessible: `role="alert"` and `aria-live="assertive"` for screen readers
  - Shows `ExclamationTriangleIcon` + message + `WifiIcon`
  - Wired into `App.jsx` as the first child of `<BrowserRouter>`

#### Frontend Polish
- **`PropertyCard` share button upgrade** (`client/src/components/PropertyCard.jsx`)
  — The share button previously had **zero visual feedback**:
  - Import `useClipboard` hook and `CheckIcon`
  - `handleShare` now `async` — properly `await`s both the Web Share API and the
    clipboard fallback so errors are caught correctly
  - Web Share API path: `navigator.share()` is tried first; if the user cancels
    or the API is unavailable, falls through to `copy(shareUrl)` instead of
    silently doing nothing
  - Description truncated to 120 chars before passing to the Share API
  - On desktop (or when the share sheet is dismissed): clipboard link is copied
    via `useClipboard({ resetDelay: 2000 })`
  - Share button icon swaps from `ShareIcon` → `CheckIcon` (green) when copied
  - Tooltip label: `"Share property"` → `"Link copied!"` during the 2 s window
  - `"Copied!"` pill tooltip appears to the left of the button while `isCopied`

---

## [1.7.0] - 2026-08-04


### ✨ Added

#### Hooks
- **`useClipboard` hook** (`client/src/hooks/useClipboard.js`) — Copies text to
  the system clipboard and provides a timed `isCopied` feedback flag:
  - Uses `navigator.clipboard.writeText` (modern Clipboard API, HTTPS/localhost)
  - Falls back to `document.execCommand('copy')` for older browsers and HTTP pages
  - `isCopied` auto-resets to `false` after a configurable `resetDelay` (default 2 s)
  - Clears any pending reset timer before each new copy — no state race conditions
  - `useRef` stores the timeout ID without causing extra re-renders
  - Silent on error: logs `console.warn` and returns `false` instead of throwing
  - Returns `true` on success, `false` on failure from the async `copy(text)` call
  - Documented with JSDoc and two usage examples
- **Applied in `Listing.jsx`** — removed the inline `copied` state +
  `setTimeout` + `navigator.clipboard.writeText` boilerplate; replaced with a
  single `const { isCopied, copy } = useClipboard()` call. No user-visible
  behaviour change.

#### Backend
- **`asyncHandler` utility** (`server/utils/asyncHandler.js`) — A one-line
  higher-order function that wraps any async Express handler and automatically
  forwards any rejected Promise to `next()`:
  - Pattern: `const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);`
  - Eliminates the `try { ... } catch (error) { next(error); }` boilerplate that
    appears ~50+ times across all controllers in this project
  - The returned function is a standard Express `RequestHandler` — compatible
    with `app.use()`, `router.get()`, `router.post()`, etc.
  - Fully documented with a JSDoc before/after example showing the improvement
  - **Applied in `user.controller.js`** as the reference integration:
    - `getUserProfile` refactored — 5 lines of try/catch removed
    - `uploadAvatar` refactored — 4 lines of try/catch removed
    - `updateUserProfile` refactored — inner async work wrapped with asyncHandler

---

## [1.6.0] - 2026-08-03


### ✨ Added

#### Hooks
- **`useWindowSize` hook** (`client/src/hooks/useWindowSize.js`) — Reactively
  tracks `window.innerWidth` / `window.innerHeight` and exposes Tailwind-aligned
  boolean breakpoints (`isMobile`, `isTablet`, `isDesktop`):
  - 100 ms debounced resize listener to avoid re-rendering on every pixel
  - `passive: true` on the resize event to never block scrolling
  - SSR-safe: initialises from `window.innerWidth` if available, otherwise 1024×768
  - Cleans up both the listener and the pending debounce timer on unmount
  - Integrated into `BackToTop.jsx` as a real-world usage example (button is now
    hidden on `isMobile` screens to avoid content overlap)

#### Frontend Reliability
- **`ErrorBoundary` component** (`client/src/components/ErrorBoundary.jsx`) — A
  React class component that catches any JavaScript error in its child tree and
  renders a styled fallback UI instead of a blank page:
  - `getDerivedStateFromError` → switches to fallback on any render error
  - `componentDidCatch` → logs error + component stack (swap for Sentry in prod)
  - "Try again" button resets the boundary by re-mounting the child tree
  - "Go to Home" button hard-navigates to `/` as a last resort
  - Error details shown in a collapsible `<details>` block in DEV mode only
  - Accepts an optional `fallback` prop for per-section custom error UI
  - Styled with site blue/indigo gradient system; PropTypes validated
  - Wrapped around the entire React tree in `main.jsx` (outermost `<Provider>`)

#### Backend
- **Detailed health check router** (`server/routes/health.route.js`) — Replaces
  the old minimal 4-field inline health object with a full monitoring-grade
  endpoint suite:
  - `GET /server/health` — fast liveness probe (no DB call), returns `status`,
    `service`, `timestamp`, and human-formatted `uptime`
  - `GET /server/health/detail` — full readiness probe returning:
    - MongoDB connection state (`connected` / `disconnected` / `connecting`)
    - Host and database name from the live Mongoose connection
    - Node.js process memory: `rss`, `heapUsed`, `heapTotal`, `external`
    - OS memory: total, free, used, usage percentage
    - CPU count, platform, Node version, environment, package version
    - `responseTimeMs` — how long the health check itself took
  - Returns HTTP `503` when the database is disconnected
  - Imports `os` module for native system metrics
  - Wired into `server/index.js` replacing the old inline `app.get('/server/health')`

---

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
