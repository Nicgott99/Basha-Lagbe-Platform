import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInSuccess,
  signOutUserSuccess,
} from "../redux/users/userSlice";

/**
 * useCrossTabSync
 * Keeps Redux authentication state in sync across multiple browser tabs
 * by listening to the native browser `storage` event.
 *
 * Problem it solves:
 *   redux-persist stores the Redux state in localStorage under the key
 *   "persist:root". When Tab A signs a user in or out, redux-persist
 *   writes the new state to localStorage. BUT Tab B has no idea this
 *   happened — it still shows the old stale state in memory. This means:
 *
 *   - User logs OUT in Tab A → Tab B still shows them as logged in.
 *     They can still click protected links, see their dashboard, etc.
 *     Only a manual page refresh fixes it.
 *
 *   - User logs IN in Tab B (e.g. they had two tabs open) → Tab A still
 *     shows the login page, even though a valid session now exists.
 *
 * Solution:
 *   The browser fires a `storage` event on ALL other tabs (not the writing
 *   tab) whenever localStorage changes. This hook listens to that event,
 *   reads the new `persist:root` value, and dispatches the appropriate Redux
 *   action to bring the in-memory state in sync.
 *
 * Behaviour:
 *   - Tab A signs OUT  → Tab B dispatches `signOutUserSuccess` and
 *     navigates to `/sign-in`
 *   - Tab A signs IN   → Tab B dispatches `signInSuccess` with the new
 *     user payload and stays on whatever page it was on
 *   - Tab A updates profile → Tab B dispatches `signInSuccess` with the
 *     updated user payload (keeps avatar/name in sync)
 *
 * Placement:
 *   Call this hook ONCE at the top level — inside App.jsx (inside
 *   BrowserRouter so useNavigate works):
 *
 *   export default function App() {
 *     useCrossTabSync();  // ← one line, handles everything
 *     return <BrowserRouter>...</BrowserRouter>;
 *   }
 *
 * Limitations:
 *   - Only syncs across tabs in the SAME origin (same domain/port).
 *     This is a browser security constraint, not a limitation of this hook.
 *   - Does NOT fire in the tab that made the change (only other tabs).
 *   - Requires redux-persist to be using localStorage (which it does by default).
 *
 * @example
 *   // In App.jsx — inside BrowserRouter, call once at the top
 *   import useCrossTabSync from './hooks/useCrossTabSync';
 *
 *   export default function App() {
 *     useCrossTabSync();
 *     return ( <Routes>...</Routes> );
 *   }
 */
const useCrossTabSync = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event) => {
      // Only react to redux-persist's root key
      if (event.key !== "persist:root") return;

      try {
        // event.newValue is the serialised JSON string of the new persist:root
        if (!event.newValue) {
          // persist:root was cleared (e.g. localStorage.clear()) — sign out
          dispatch(signOutUserSuccess());
          navigate("/sign-in", { replace: true });
          return;
        }

        const newRoot = JSON.parse(event.newValue);

        // redux-persist double-serialises: the "user" key is a JSON string itself
        if (!newRoot.user) return;

        const newUserState = JSON.parse(newRoot.user);

        if (newUserState.currentUser) {
          // Another tab signed in or updated their profile — sync the user
          dispatch(signInSuccess(newUserState.currentUser));
        } else {
          // Another tab signed out — sign out this tab too and redirect
          dispatch(signOutUserSuccess());
          navigate("/sign-in", { replace: true });
        }
      } catch (err) {
        // Silently ignore parse errors — stale or malformed storage values
        // should not crash the app
        console.warn("[useCrossTabSync] Failed to parse storage event:", err.message);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch, navigate]);
};

export default useCrossTabSync;
