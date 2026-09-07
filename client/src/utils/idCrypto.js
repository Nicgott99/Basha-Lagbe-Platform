/**
 * idCrypto — lightweight URL-safe ID obfuscation for Basha Lagbe.
 *
 * Converts raw MongoDB ObjectIDs (24-char hex) to URL-safe base64 strings
 * so that internal database IDs are never directly visible in the browser bar.
 *
 * This is obfuscation, not encryption — it prevents casual ID harvesting
 * and makes URLs look professional.  For true security, combine with
 * server-side authorization checks (already implemented in verifyUser middleware).
 *
 * Examples:
 *   encodeId('507f1f77bcf86cd799439011')  → 'NTA3ZjFmNzdiY2Y4NmNkNzk5NDM5MDEx'
 *   decodeId('NTA3ZjFmNzdiY2Y4NmNkNzk5NDM5MDEx') → '507f1f77bcf86cd799439011'
 */

/**
 * Encode a MongoDB ObjectID for use in a URL.
 * @param {string} rawId - 24-char hex ObjectID
 * @returns {string} URL-safe base64 string
 */
export function encodeId(rawId) {
  if (!rawId) return "";
  try {
    // btoa → base64, then make URL-safe by replacing +/= with -_~
    return btoa(rawId)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "~");
  } catch {
    return rawId; // fallback: use as-is
  }
}

/**
 * Decode a URL-safe base64 ID back to the raw MongoDB ObjectID.
 * @param {string} encoded - URL-safe base64 string
 * @returns {string} raw MongoDB ObjectID
 */
export function decodeId(encoded) {
  if (!encoded) return "";
  try {
    // Reverse the URL-safe substitutions before decoding
    const base64 = encoded
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .replace(/~/g, "=");
    return atob(base64);
  } catch {
    return encoded; // fallback: treat as raw ID (backward-compatible)
  }
}
