import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { XMarkIcon, CogIcon } from "@heroicons/react/24/outline";
import { onConsentGranted } from "../utils/analytics";

const COOKIE_KEY = "bl_cookie_consent";

/**
 * CookieBanner
 * Shown once per browser session (persisted in localStorage).
 * Allows Accept All, Decline, or Manage (granular) options.
 */
const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary: true,   // always on
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      // Small delay so it doesn't fight with page paint
      const timer = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const save = (consentPrefs) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...consentPrefs, ts: Date.now() }));
    setVisible(false);
    setManaging(false);
    if (consentPrefs.analytics) {
      onConsentGranted();
    }
  };

  const acceptAll = () => save({ necessary: true, analytics: true, marketing: true });
  const declineAll = () => save({ necessary: true, analytics: false, marketing: false });
  const savePrefs = () => save(prefs);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
          role="dialog"
          aria-modal="true"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-4 right-4 z-[9999] max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Top bar */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 flex items-center justify-between">
              <span className="text-white font-semibold text-sm flex items-center gap-2">
                🍪 Cookie Preferences
              </span>
              <button
                onClick={declineAll}
                aria-label="Decline and close"
                className="text-white/70 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              {!managing ? (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    We use cookies to improve your experience, analyse site traffic, and personalise
                    content. Read our{" "}
                    <Link
                      to="/privacy-policy"
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>{" "}
                    to learn more.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={acceptAll}
                      className="flex-1 min-w-[120px] bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={() => setManaging(true)}
                      className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
                    >
                      <CogIcon className="w-4 h-4" />
                      Manage
                    </button>
                    <button
                      onClick={declineAll}
                      className="flex-1 min-w-[100px] text-gray-500 hover:text-gray-700 font-medium py-2.5 px-4 rounded-xl text-sm border border-gray-200 hover:border-gray-300 transition-all"
                    >
                      Decline
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-sm mb-4 font-medium">
                    Manage your cookie preferences:
                  </p>

                  <div className="space-y-3 mb-4">
                    {/* Necessary */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Necessary</p>
                        <p className="text-xs text-gray-500">Required for the site to function</p>
                      </div>
                      <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-full">
                        Always on
                      </span>
                    </div>

                    {/* Analytics */}
                    <label className="flex items-center justify-between bg-gray-50 rounded-xl p-3 cursor-pointer">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Analytics</p>
                        <p className="text-xs text-gray-500">Help us understand how you use the site</p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={prefs.analytics}
                        onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          prefs.analytics ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            prefs.analytics ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </label>

                    {/* Marketing */}
                    <label className="flex items-center justify-between bg-gray-50 rounded-xl p-3 cursor-pointer">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">Marketing</p>
                        <p className="text-xs text-gray-500">Personalised ads and recommendations</p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={prefs.marketing}
                        onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          prefs.marketing ? "bg-indigo-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            prefs.marketing ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={savePrefs}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
                    >
                      Save Preferences
                    </button>
                    <button
                      onClick={() => setManaging(false)}
                      className="text-gray-500 hover:text-gray-700 font-medium py-2.5 px-4 rounded-xl text-sm border border-gray-200 transition-all"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
