import { useState, useEffect, useCallback, useRef } from "react";

/**
 * useFormPersistence
 * Automatically saves form state to sessionStorage and restores it when the
 * user returns to the page. Prevents data loss on accidental refresh, tab
 * switch, or browser crash — especially critical for multi-step forms like
 * AddProperty where users fill in 5+ steps.
 *
 * Problem it solves:
 *   The AddProperty multi-step form has no persistence. If a landlord fills in
 *   3 of 5 steps and accidentally hits F5 or closes the tab, ALL data is lost
 *   and they have to start from scratch. This is a major UX failure — it kills
 *   listing creation completion rates.
 *
 *   sessionStorage (not localStorage) is used intentionally:
 *   - Cleared when the browser tab closes — prevents stale draft data persisting
 *     across sessions (a user coming back days later would see stale data)
 *   - Isolated per browser tab — two tabs creating different listings don't
 *     interfere with each other
 *   - Not synced via useCrossTabSync (sessionStorage events don't cross tabs)
 *
 * @param {string}   key          - Unique sessionStorage key for this form's data
 * @param {Object}   initialState - The initial form state (same as useState initialState)
 * @param {Object}   [options]
 * @param {number}   [options.debounceMs=500]
 *   How many ms to wait after the last change before writing to sessionStorage.
 *   Prevents excessive storage writes on every keystroke.
 * @param {Function} [options.serialize=JSON.stringify]
 *   Custom serialisation function (e.g. for Date objects).
 * @param {Function} [options.deserialize=JSON.parse]
 *   Custom deserialisation function.
 * @param {boolean}  [options.enabled=true]
 *   Set to false to disable persistence entirely (e.g. when running tests).
 * @param {string[]} [options.excludeFields=[]]
 *   Field names (top-level keys) to exclude from persistence — useful for
 *   sensitive fields like passwords or payment info.
 *
 * @returns {[Object, Function, Object]}
 *   - [0] formState — the current form state (like useState's state)
 *   - [1] setFormState — setter (like useState's setter, supports functional updates)
 *   - [2] helpers — { clearPersisted, hasPersisted, lastSaved }
 *     - clearPersisted()  — manually clear sessionStorage (call on successful submit)
 *     - hasPersisted      — true if restored data was found on mount
 *     - lastSaved         — Date of last successful save (or null)
 *
 * @example
 *   // Drop-in useState replacement in AddProperty.jsx
 *   const [formData, setFormData, { clearPersisted, hasPersisted }] = useFormPersistence(
 *     'add-property-draft',
 *     { title: '', description: '', rentPrice: '' }
 *   );
 *
 *   // On successful submit, clear the draft
 *   const handleSubmit = async () => {
 *     await apiService.listing.create(formData);
 *     clearPersisted();
 *     navigate('/dashboard');
 *   };
 *
 *   // Optionally show a "Restored draft" banner
 *   {hasPersisted && <InfoBanner>Your previous draft has been restored.</InfoBanner>}
 *
 * @example
 *   // Exclude sensitive fields from persistence
 *   const [form, setForm] = useFormPersistence('checkout', initialState, {
 *     excludeFields: ['cardNumber', 'cvv'],
 *   });
 *
 * @example
 *   // Custom serialisation for Date objects
 *   const [form, setForm] = useFormPersistence('booking', initial, {
 *     serialize:   (v) => JSON.stringify(v, null, 0),
 *     deserialize: (s) => {
 *       const parsed = JSON.parse(s);
 *       if (parsed.date) parsed.date = new Date(parsed.date);
 *       return parsed;
 *     },
 *   });
 */
const useFormPersistence = (key, initialState, {
  debounceMs    = 500,
  serialize     = JSON.stringify,
  deserialize   = JSON.parse,
  enabled       = true,
  excludeFields = [],
} = {}) => {
  // ── Restore from sessionStorage on first render ────────────────────────────
  const [hasPersisted] = useState(() => {
    if (!enabled || typeof sessionStorage === "undefined") return false;
    try {
      const stored = sessionStorage.getItem(key);
      return stored !== null;
    } catch {
      return false;
    }
  });

  const [formState, setFormStateRaw] = useState(() => {
    if (!enabled || typeof sessionStorage === "undefined") return initialState;
    try {
      const stored = sessionStorage.getItem(key);
      if (!stored) return initialState;
      const parsed = deserialize(stored);
      // Merge with initialState so new fields added after first save are included
      return { ...initialState, ...parsed };
    } catch (err) {
      console.warn(`[useFormPersistence] Failed to restore "${key}":`, err.message);
      return initialState;
    }
  });

  const [lastSaved, setLastSaved] = useState(null);
  const debounceTimer             = useRef(null);
  const latestState               = useRef(formState);

  // Keep latestState in sync so the debounced write always has the latest value
  useEffect(() => {
    latestState.current = formState;
  }, [formState]);

  // ── Debounced write to sessionStorage ────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      try {
        let stateToSave = latestState.current;

        // Remove excluded fields before persisting
        if (excludeFields.length > 0) {
          stateToSave = { ...stateToSave };
          excludeFields.forEach((field) => delete stateToSave[field]);
        }

        sessionStorage.setItem(key, serialize(stateToSave));
        setLastSaved(new Date());
      } catch (err) {
        // QuotaExceededError — storage is full (e.g. many large images encoded)
        // Silently ignore — the form still works, just without persistence
        if (err.name !== "QuotaExceededError") {
          console.warn(`[useFormPersistence] Failed to save "${key}":`, err.message);
        }
      }
    }, debounceMs);

    return () => clearTimeout(debounceTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState, key, debounceMs, enabled, serialize]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  // ── Setters ───────────────────────────────────────────────────────────────
  const setFormState = useCallback((updater) => {
    setFormStateRaw((prev) =>
      typeof updater === "function" ? updater(prev) : updater
    );
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const clearPersisted = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
      setLastSaved(null);
    } catch {
      // ignore
    }
  }, [key]);

  return [
    formState,
    setFormState,
    { clearPersisted, hasPersisted, lastSaved },
  ];
};

export default useFormPersistence;
