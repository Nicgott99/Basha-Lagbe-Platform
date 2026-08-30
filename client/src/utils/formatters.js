/**
 * formatters.js
 * Centralized formatting utilities for currency, dates, numbers, and text
 * throughout the Basha Lagbe frontend.
 *
 * Problem it solves:
 *   Currency and date formatting is scattered across 10+ files with subtle
 *   inconsistencies:
 *   - Some use ৳{val.toLocaleString()}          (no locale specified)
 *   - Some use ${val.toLocaleString('en-US')}    (USD symbol, wrong currency)
 *   - Some use /mo, some use /month, some use /Month
 *   - Dates are formatted with new Date(x).toLocaleString() (browser locale,
 *     inconsistent across devices and regions)
 *   - No null/undefined guards — causes "৳undefined" or "NaN" renders
 *
 *   This utility provides a single source of truth for all display formatting,
 *   making it easy to change formats globally (e.g., switch to BDT locale or
 *   add thousands separators) without touching 20 components.
 *
 * Usage:
 *   import { formatCurrency, formatDate, formatRelativeTime, formatNumber } from '../utils/formatters';
 *
 *   // Currency
 *   formatCurrency(15000)          // → "৳15,000"
 *   formatCurrency(15000, '/mo')   // → "৳15,000/mo"
 *   formatCurrency(null)           // → "Price on request"
 *
 *   // Dates
 *   formatDate(listing.createdAt)              // → "Aug 31, 2026"
 *   formatDate(listing.createdAt, 'long')      // → "August 31, 2026"
 *   formatDate(listing.createdAt, 'datetime')  // → "Aug 31, 2026, 2:40 PM"
 *
 *   // Relative time
 *   formatRelativeTime(new Date(Date.now() - 3600_000))  // → "1 hour ago"
 *   formatRelativeTime(new Date(Date.now() - 86400_000)) // → "1 day ago"
 *
 *   // Numbers
 *   formatNumber(1234567)   // → "1,234,567"
 *   formatNumber(1234, 'compact') // → "1.2K"
 */

// ── Currency ────────────────────────────────────────────────────────────────

/**
 * Format a number as Bangladeshi Taka (৳).
 *
 * @param {number|string|null|undefined} amount - The price value
 * @param {string} [suffix='']   - Optional suffix: '/mo', '/month', '/year'
 * @param {string} [fallback='Price on request'] - Shown when amount is falsy
 * @returns {string}
 *
 * @example
 *   formatCurrency(15000)         // "৳15,000"
 *   formatCurrency(15000, '/mo')  // "৳15,000/mo"
 *   formatCurrency(0)             // "৳0"
 *   formatCurrency(null)          // "Price on request"
 *   formatCurrency(undefined)     // "Price on request"
 *   formatCurrency('15000')       // "৳15,000"  (string coercion)
 */
export const formatCurrency = (amount, suffix = '', fallback = 'Price on request') => {
  const num = Number(amount);
  if (amount === null || amount === undefined || amount === '') return fallback;
  if (isNaN(num)) return fallback;
  const formatted = num.toLocaleString('en-BD'); // Bengali locale with comma separators
  return `৳${formatted}${suffix}`;
};

/**
 * Format as monthly rent (the most common use case in property listings).
 * Shorthand for formatCurrency(amount, '/mo').
 *
 * @param {number|null} amount
 * @returns {string}  e.g. "৳15,000/mo"
 */
export const formatRent = (amount) => formatCurrency(amount, '/mo');

// ── Dates ───────────────────────────────────────────────────────────────────

/** @type {Record<string, Intl.DateTimeFormatOptions>} */
const DATE_FORMATS = {
  short:    { year: 'numeric', month: 'short',  day: 'numeric' },              // "Aug 31, 2026"
  long:     { year: 'numeric', month: 'long',   day: 'numeric' },              // "August 31, 2026"
  numeric:  { year: 'numeric', month: '2-digit', day: '2-digit' },             // "08/31/2026"
  datetime: { year: 'numeric', month: 'short',  day: 'numeric',
              hour: 'numeric', minute: '2-digit', hour12: true },               // "Aug 31, 2026, 2:40 PM"
  time:     { hour: 'numeric', minute: '2-digit', hour12: true },               // "2:40 PM"
};

/**
 * Format a date value into a human-readable string.
 *
 * @param {Date|string|number|null|undefined} value - Any date-parseable value
 * @param {'short'|'long'|'numeric'|'datetime'|'time'} [format='short']
 * @param {string} [locale='en-BD']
 * @param {string} [fallback='—']
 * @returns {string}
 *
 * @example
 *   formatDate('2026-08-31')              // "Aug 31, 2026"
 *   formatDate('2026-08-31', 'long')      // "August 31, 2026"
 *   formatDate('2026-08-31', 'datetime')  // "Aug 31, 2026, 12:00 AM"
 *   formatDate(null)                      // "—"
 *   formatDate('not-a-date')              // "—"
 */
export const formatDate = (value, format = 'short', locale = 'en-BD', fallback = '—') => {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return fallback;
  try {
    return date.toLocaleDateString(locale, DATE_FORMATS[format] || DATE_FORMATS.short);
  } catch {
    return date.toLocaleDateString('en-US', DATE_FORMATS[format] || DATE_FORMATS.short);
  }
};

// ── Relative Time ────────────────────────────────────────────────────────────

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR   = 60 * MINUTE;
const DAY    = 24 * HOUR;
const WEEK   = 7  * DAY;
const MONTH  = 30 * DAY;
const YEAR   = 365 * DAY;

/**
 * Format a date as a human-readable relative time string.
 * Uses Intl.RelativeTimeFormat when available (modern browsers),
 * falls back to a manual implementation.
 *
 * @param {Date|string|number|null} value
 * @param {string} [locale='en']
 * @param {string} [fallback='—']
 * @returns {string}
 *
 * @example
 *   formatRelativeTime(new Date())                              // "just now"
 *   formatRelativeTime(new Date(Date.now() - 30_000))          // "30 seconds ago"
 *   formatRelativeTime(new Date(Date.now() - 3_600_000))       // "1 hour ago"
 *   formatRelativeTime(new Date(Date.now() - 86_400_000))      // "1 day ago"
 *   formatRelativeTime(new Date(Date.now() - 7 * 86_400_000))  // "1 week ago"
 *   formatRelativeTime(new Date('2025-01-01'))                  // "1 year ago"
 */
export const formatRelativeTime = (value, locale = 'en', fallback = '—') => {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return fallback;

  const diff    = Date.now() - date.getTime(); // positive = past
  const absDiff = Math.abs(diff);

  // Use Intl.RelativeTimeFormat when available
  if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const sign = diff >= 0 ? -1 : 1; // past = negative for RTF

    if (absDiff < MINUTE) return rtf.format(sign * Math.round(absDiff / SECOND), 'second');
    if (absDiff < HOUR)   return rtf.format(sign * Math.round(absDiff / MINUTE), 'minute');
    if (absDiff < DAY)    return rtf.format(sign * Math.round(absDiff / HOUR),   'hour');
    if (absDiff < WEEK)   return rtf.format(sign * Math.round(absDiff / DAY),    'day');
    if (absDiff < MONTH)  return rtf.format(sign * Math.round(absDiff / WEEK),   'week');
    if (absDiff < YEAR)   return rtf.format(sign * Math.round(absDiff / MONTH),  'month');
    return rtf.format(sign * Math.round(absDiff / YEAR), 'year');
  }

  // Manual fallback
  if (absDiff < MINUTE) return 'just now';
  if (absDiff < HOUR)   return `${Math.round(absDiff / MINUTE)} minutes ago`;
  if (absDiff < DAY)    return `${Math.round(absDiff / HOUR)} hours ago`;
  if (absDiff < WEEK)   return `${Math.round(absDiff / DAY)} days ago`;
  if (absDiff < MONTH)  return `${Math.round(absDiff / WEEK)} weeks ago`;
  if (absDiff < YEAR)   return `${Math.round(absDiff / MONTH)} months ago`;
  return `${Math.round(absDiff / YEAR)} years ago`;
};

// ── Numbers ──────────────────────────────────────────────────────────────────

/**
 * Format a plain number with locale-appropriate separators.
 *
 * @param {number|string|null} value
 * @param {'default'|'compact'} [style='default']
 *   'compact' → "1.2K", "1.5M" (useful for stats counters)
 * @param {string} [locale='en-BD']
 * @param {string} [fallback='—']
 * @returns {string}
 *
 * @example
 *   formatNumber(1234567)           // "1,234,567"
 *   formatNumber(1234, 'compact')   // "1.2K"
 *   formatNumber(1500000, 'compact')// "1.5M"
 *   formatNumber(null)              // "—"
 */
export const formatNumber = (value, style = 'default', locale = 'en-BD', fallback = '—') => {
  const num = Number(value);
  if (value === null || value === undefined || isNaN(num)) return fallback;

  if (style === 'compact') {
    if (typeof Intl !== 'undefined') {
      return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(num);
    }
    // Manual compact fallback
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
    return String(num);
  }

  return num.toLocaleString(locale);
};

// ── Text ─────────────────────────────────────────────────────────────────────

/**
 * Truncate a string to a maximum length, appending '…' if truncated.
 *
 * @param {string|null|undefined} text
 * @param {number} [maxLength=120]
 * @returns {string}
 *
 * @example
 *   truncate('Hello World', 5)  // "Hello…"
 *   truncate(null)              // ""
 */
export const truncate = (text, maxLength = 120) => {
  if (!text) return '';
  const str = String(text);
  return str.length > maxLength ? `${str.slice(0, maxLength)}…` : str;
};

/**
 * Capitalise the first letter of a string.
 *
 * @param {string|null|undefined} text
 * @returns {string}
 */
export const capitalise = (text) => {
  if (!text) return '';
  const str = String(text);
  return str.charAt(0).toUpperCase() + str.slice(1);
};
