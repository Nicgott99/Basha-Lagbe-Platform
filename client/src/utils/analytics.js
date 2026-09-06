/**
 * Analytics utility for Basha Lagbe
 *
 * Provides a unified interface for tracking page views and events.
 * Respects the user's cookie consent stored in localStorage.
 * Sends data to Google Analytics 4 when analytics consent is granted.
 *
 * Usage:
 *   import { trackEvent, trackPageView } from '../utils/analytics';
 *   trackEvent('property_view', { property_id: 'xyz', area: 'Gulshan' });
 */

const CONSENT_KEY = "bl_cookie_consent";
const GA_ID = import.meta.env.VITE_GA_ID || "";   // Set VITE_GA_ID in .env

// ─── Consent check ────────────────────────────────────────────────────────────
function hasAnalyticsConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const prefs = JSON.parse(raw);
    return prefs.analytics === true;
  } catch {
    return false;
  }
}

// ─── gtag helper ──────────────────────────────────────────────────────────────
function gtag(...args) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

// ─── Bootstrap GA4 ───────────────────────────────────────────────────────────
export function initAnalytics() {
  if (!GA_ID || !hasAnalyticsConsent()) return;
  if (document.getElementById("ga-script")) return; // already loaded

  // Inject GA4 script
  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    anonymize_ip: true,          // GDPR compliance
    cookie_flags: "SameSite=None;Secure",
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────
/**
 * Track a page view. Called automatically by useAnalytics hook on route change.
 * @param {string} path - e.g. "/search"
 * @param {string} title - page title
 */
export function trackPageView(path, title) {
  if (!hasAnalyticsConsent()) return;
  gtag("event", "page_view", {
    page_path: path,
    page_title: title,
  });
}

/**
 * Track a custom event.
 * @param {string} eventName - e.g. "property_view", "contact_landlord"
 * @param {object} params    - additional event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (!hasAnalyticsConsent()) return;
  gtag("event", eventName, params);
}

/**
 * Re-initialize analytics (call after user accepts cookies).
 */
export function onConsentGranted() {
  initAnalytics();
  trackPageView(window.location.pathname, document.title);
}
