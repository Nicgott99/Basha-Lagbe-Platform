import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useCountdown
 * A reusable countdown timer hook that counts down from a given number of
 * seconds to zero, then fires an optional callback.
 *
 * Problem it solves:
 *   SignIn.jsx, SignUp.jsx, and ForgotPassword.jsx each re-implement the same
 *   resendTimer pattern: useState(0), useEffect with setTimeout, clearTimeout.
 *   This hook centralises that logic.
 *
 * @param {Object} [options]
 * @param {number}   [options.initialSeconds=60] - Starting value in seconds
 * @param {boolean}  [options.autoStart=false]   - Start counting down immediately on mount
 * @param {Function} [options.onComplete]         - Called when the counter reaches 0
 *
 * @returns {{
 *   count:     number,    - Current countdown value (0 to initialSeconds)
 *   isRunning: boolean,   - True while the countdown is active
 *   isDone:    boolean,   - True when count === 0 (and it was started at least once)
 *   start:     () => void, - Start / restart the countdown from initialSeconds
 *   stop:      () => void, - Pause without resetting the count
 *   reset:     () => void, - Stop and reset count to initialSeconds
 * }}
 *
 * @example
 *   // Resend OTP timer (start on button click)
 *   const { count, isRunning, start } = useCountdown({ initialSeconds: 60 });
 *
 *   return (
 *     <button onClick={start} disabled={isRunning}>
 *       {isRunning ? `Resend in ${count}s` : 'Resend Code'}
 *     </button>
 *   );
 *
 * @example
 *   // Auto-start on mount with a completion callback
 *   const { count } = useCountdown({
 *     initialSeconds: 300,
 *     autoStart: true,
 *     onComplete: () => console.log('Session expired'),
 *   });
 */
const useCountdown = ({
  initialSeconds = 60,
  autoStart     = false,
  onComplete    = null,
} = {}) => {
  const [count,     setCount]     = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [started,   setStarted]   = useState(autoStart);

  const timerRef       = useRef(null);
  const onCompleteRef  = useRef(onComplete);
  // Keep the callback ref fresh without adding it to the dependency array
  onCompleteRef.current = onComplete;

  // Core tick effect — runs whenever isRunning or count changes
  useEffect(() => {
    if (!isRunning) return;

    if (count <= 0) {
      setIsRunning(false);
      onCompleteRef.current?.();
      return;
    }

    timerRef.current = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [count, isRunning]);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  /** Start or restart the countdown from initialSeconds */
  const start = useCallback(() => {
    clearTimeout(timerRef.current);
    setCount(initialSeconds);
    setStarted(true);
    setIsRunning(true);
  }, [initialSeconds]);

  /** Pause without resetting */
  const stop = useCallback(() => {
    clearTimeout(timerRef.current);
    setIsRunning(false);
  }, []);

  /** Stop and reset to initialSeconds */
  const reset = useCallback(() => {
    clearTimeout(timerRef.current);
    setCount(initialSeconds);
    setIsRunning(false);
    setStarted(false);
  }, [initialSeconds]);

  return {
    count,
    isRunning,
    isDone: started && count === 0,
    start,
    stop,
    reset,
  };
};

export default useCountdown;
