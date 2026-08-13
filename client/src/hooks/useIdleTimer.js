import { useState, useEffect, useRef, useCallback } from "react";
import useEventListener from "./useEventListener";

/**
 * useIdleTimer
 * Detects user inactivity after a configurable timeout and fires callbacks
 * when the user goes idle or returns to activity.
 *
 * Problem it solves:
 *   AddProperty.jsx has a multi-step form where users can spend 20+ minutes
 *   filling in details. If they walk away, their unsaved work may be lost or
 *   their session may expire silently. This hook lets the app warn them.
 *
 * Monitored events (on window):
 *   mousemove, mousedown, keydown, touchstart, scroll, wheel, visibilitychange
 *
 * @param {Object}   options
 * @param {number}   [options.timeout=300000]   - Idle timeout in ms (default 5 minutes)
 * @param {Function} [options.onIdle]            - Called when user goes idle
 * @param {Function} [options.onActive]          - Called when user returns from idle
 * @param {boolean}  [options.enabled=true]      - Set false to disable the timer entirely
 *
 * @returns {{ isIdle: boolean, reset: () => void, activate: () => void }}
 *   - isIdle:   true when the user has been inactive for `timeout` ms
 *   - reset:    Restart the idle countdown (call after any programmatic action)
 *   - activate: Programmatically mark user as active (e.g. on API call success)
 *
 * @example
 *   // Warn user after 10 minutes of inactivity on AddProperty form
 *   const { isIdle } = useIdleTimer({
 *     timeout: 10 * 60 * 1000,
 *     onIdle: () => showToast('Your session may expire soon. Save your work!'),
 *   });
 *
 * @example
 *   // Auto-save a draft when user goes idle
 *   const { isIdle } = useIdleTimer({ timeout: 30_000 });
 *   useEffect(() => {
 *     if (isIdle) saveDraft();
 *   }, [isIdle]);
 *
 * @example
 *   // Pause video playback while idle
 *   const { isIdle } = useIdleTimer({ timeout: 5_000 });
 *   useEffect(() => {
 *     isIdle ? videoRef.current?.pause() : videoRef.current?.play();
 *   }, [isIdle]);
 */
const IDLE_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
  "visibilitychange",
];

const useIdleTimer = ({
  timeout  = 5 * 60 * 1000, // 5 minutes
  onIdle   = null,
  onActive = null,
  enabled  = true,
} = {}) => {
  const [isIdle, setIsIdle]   = useState(false);
  const timerRef              = useRef(null);
  const isIdleRef             = useRef(false);

  const onIdleRef   = useRef(onIdle);
  const onActiveRef = useRef(onActive);
  // Keep callbacks fresh without re-subscribing
  useEffect(() => { onIdleRef.current   = onIdle;   }, [onIdle]);
  useEffect(() => { onActiveRef.current = onActive; }, [onActive]);

  const goIdle = useCallback(() => {
    if (isIdleRef.current) return; // Already idle — don't fire twice
    isIdleRef.current = true;
    setIsIdle(true);
    onIdleRef.current?.();
  }, []);

  const goActive = useCallback(() => {
    if (!isIdleRef.current) return; // Already active — don't fire twice
    isIdleRef.current = false;
    setIsIdle(false);
    onActiveRef.current?.();
  }, []);

  const reset = useCallback(() => {
    if (!enabled) return;
    clearTimeout(timerRef.current);
    goActive();
    timerRef.current = setTimeout(goIdle, timeout);
  }, [enabled, timeout, goActive, goIdle]);

  // Expose as a stable activate alias
  const activate = useCallback(() => {
    reset();
  }, [reset]);

  // Start timer on mount / when enabled
  useEffect(() => {
    if (!enabled) {
      clearTimeout(timerRef.current);
      if (isIdleRef.current) goActive();
      return;
    }
    timerRef.current = setTimeout(goIdle, timeout);
    return () => clearTimeout(timerRef.current);
  }, [enabled, timeout, goIdle, goActive]);

  // Attach all activity listeners via useEventListener
  IDLE_EVENTS.forEach((event) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEventListener(event, reset, window, { passive: true });
  });

  return { isIdle, reset, activate };
};

export default useIdleTimer;
