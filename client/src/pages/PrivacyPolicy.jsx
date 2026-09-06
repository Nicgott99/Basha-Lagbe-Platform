import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheckIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import SEO from "../components/SEO";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-3 border-l-4 border-indigo-500 pl-4">
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  const lastUpdated = "1 September 2026";

  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn how Basha Lagbe collects, uses, and protects your personal information on our property rental platform in Bangladesh."
        url="/privacy-policy"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-2xl">
                <ShieldCheckIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-500 text-sm mt-1">Last updated: {lastUpdated}</p>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-indigo-800">
              By using Basha Lagbe, you agree to the collection and use of information described in this policy.
              If you have questions, email us at{" "}
              <a
                href="mailto:privacy@bashalagbe.com"
                className="font-semibold underline hover:text-indigo-900"
              >
                privacy@bashalagbe.com
              </a>
              .
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >
            <Section title="1. Information We Collect">
              <p>
                We collect information you provide directly to us, such as when you create an account,
                post a property listing, submit a rental application, or contact support.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Account information:</strong> name, email address, password (hashed), phone number.
                </li>
                <li>
                  <strong>Profile information:</strong> profile photo, location preferences, rental history.
                </li>
                <li>
                  <strong>Listing information:</strong> property details, photos, pricing, and address.
                </li>
                <li>
                  <strong>Communication data:</strong> messages exchanged between landlords and tenants.
                </li>
                <li>
                  <strong>Usage data:</strong> pages visited, search queries, device type, IP address, browser.
                </li>
              </ul>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Create and manage your account and verify your identity.</li>
                <li>Display property listings and facilitate connections between landlords and tenants.</li>
                <li>Send you transactional emails (password reset, booking confirmations).</li>
                <li>Improve platform features, fix bugs, and conduct analytics.</li>
                <li>Comply with legal obligations and prevent fraud.</li>
              </ul>
              <p>We do <strong>not</strong> sell your personal data to third parties.</p>
            </Section>

            <Section title="3. Cookies and Tracking">
              <p>
                We use cookies and similar technologies to keep you signed in, remember your preferences,
                and understand how you use our platform. You can manage cookies through your browser settings.
                Our cookie banner gives you granular control over non-essential cookies.
              </p>
            </Section>

            <Section title="4. Information Sharing">
              <p>We may share your information with:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Other users:</strong> your public profile name and listing details are visible to
                  all visitors.
                </li>
                <li>
                  <strong>Service providers:</strong> cloud hosting, email delivery, and analytics services
                  under strict data processing agreements.
                </li>
                <li>
                  <strong>Legal authorities:</strong> when required by law or to protect our rights.
                </li>
              </ul>
            </Section>

            <Section title="5. Data Retention">
              <p>
                We retain your data for as long as your account is active or as needed to provide services.
                You may request deletion of your account and associated data by contacting us. Some data may
                be retained for up to 7 years for legal and financial compliance.
              </p>
            </Section>

            <Section title="6. Data Security">
              <p>
                We use industry-standard security measures including HTTPS encryption, bcrypt password
                hashing, JWT authentication tokens, and rate limiting to protect your personal data.
                However, no method of transmission over the Internet is 100% secure.
              </p>
            </Section>

            <Section title="7. Your Rights">
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access, correct, or delete your personal data.</li>
                <li>Object to or restrict certain processing activities.</li>
                <li>Withdraw consent at any time (where processing is based on consent).</li>
                <li>Request a portable copy of your data.</li>
              </ul>
              <p>
                To exercise these rights, email{" "}
                <a
                  href="mailto:privacy@bashalagbe.com"
                  className="text-indigo-600 hover:underline font-medium"
                >
                  privacy@bashalagbe.com
                </a>
                .
              </p>
            </Section>

            <Section title="8. Children's Privacy">
              <p>
                Basha Lagbe is not intended for children under 18 years of age. We do not knowingly
                collect personal information from children. If you believe a child has provided us
                with their data, please contact us immediately.
              </p>
            </Section>

            <Section title="9. Changes to This Policy">
              <p>
                We may update this Privacy Policy periodically. When we do, we will revise the
                "Last Updated" date at the top of this page and notify registered users via email
                for material changes.
              </p>
            </Section>

            <Section title="10. Contact Us">
              <p>If you have questions about this Privacy Policy, please contact:</p>
              <div className="bg-gray-50 rounded-xl p-4 mt-2">
                <p className="font-semibold text-gray-900">Basha Lagbe Privacy Team</p>
                <p>Email:{" "}
                  <a
                    href="mailto:privacy@bashalagbe.com"
                    className="text-indigo-600 hover:underline"
                  >
                    privacy@bashalagbe.com
                  </a>
                </p>
                <p>Address: Dhaka, Bangladesh</p>
              </div>
            </Section>
          </motion.div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Also see our{" "}
            <Link to="/terms" className="text-indigo-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/accessibility" className="text-indigo-600 hover:underline">
              Accessibility Statement
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
