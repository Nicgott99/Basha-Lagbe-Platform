import PropTypes from "prop-types";

/**
 * Compute the strength of a password.
 * Returns an object with a numeric score (0-4) and a label.
 *
 * Criteria (each adds 1 to the score):
 *   1. At least 8 characters
 *   2. Contains lowercase letter
 *   3. Contains uppercase letter
 *   4. Contains a digit
 *   5. Contains a special character
 *
 * Score → label mapping:
 *   0-1  → Weak   (red)
 *   2    → Fair   (orange)
 *   3    → Good   (yellow)
 *   4-5  → Strong (green)
 */
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", percent: 0, colour: "" };

  let score = 0;
  if (password.length >= 8)              score++;
  if (/[a-z]/.test(password))           score++;
  if (/[A-Z]/.test(password))           score++;
  if (/[0-9]/.test(password))           score++;
  if (/[^a-zA-Z0-9]/.test(password))    score++;

  const map = [
    { label: "Very Weak", percent: 15,  colour: "bg-red-500",    text: "text-red-600" },
    { label: "Weak",      percent: 30,  colour: "bg-red-400",    text: "text-red-500" },
    { label: "Fair",      percent: 55,  colour: "bg-orange-400", text: "text-orange-500" },
    { label: "Good",      percent: 75,  colour: "bg-yellow-400", text: "text-yellow-600" },
    { label: "Strong",    percent: 100, colour: "bg-green-500",  text: "text-green-600" },
  ];

  return { score, ...map[score] ?? map[4] };
};

/**
 * PasswordStrength
 * A visual password strength meter displayed below the password input.
 * Shows a segmented progress bar and a label ("Weak", "Fair", "Strong", …).
 * Also displays up to 4 live requirement hints that tick off as the user types.
 *
 * @param {string} password - The current password value from the input
 *
 * @example
 *   <PasswordStrength password={formData.password} />
 */
const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const { label, percent, colour, text } = getPasswordStrength(password);

  const requirements = [
    { met: password.length >= 8,           text: "At least 8 characters" },
    { met: /[A-Z]/.test(password),         text: "One uppercase letter" },
    { met: /[0-9]/.test(password),         text: "One number" },
    { met: /[^a-zA-Z0-9]/.test(password),  text: "One special character (!@#$…)" },
  ];

  return (
    <div className="mt-2 space-y-2">
      {/* ── Bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${colour}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className={`text-xs font-semibold w-16 text-right ${text}`}>
          {label}
        </span>
      </div>

      {/* ── Requirements checklist ───────────────────────────────────── */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
        {requirements.map((req) => (
          <li key={req.text} className="flex items-center gap-1 text-xs">
            {req.met ? (
              <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-gray-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            )}
            <span className={req.met ? "text-green-700" : "text-gray-400"}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

PasswordStrength.propTypes = {
  password: PropTypes.string.isRequired,
};

export default PasswordStrength;
