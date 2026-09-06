import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { EyeIcon, ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import SEO from "../components/SEO";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-3 border-l-4 border-green-500 pl-4">
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const commitments = [
  "Keyboard-navigable interface with visible focus indicators",
  "Sufficient colour contrast ratios (WCAG AA level)",
  "Alternative text on all meaningful images",
  "Semantic HTML with correct heading hierarchy",
  "Screen-reader-compatible form labels and ARIA attributes",
  "Responsive layouts that work from 320 px to 4K displays",
  "No content that flashes more than three times per second",
  "Skip-to-content link available on all pages",
  "Descriptive link text (no 'click here')",
  "Error messages that are identifiable without colour alone",
];

const Accessibility = () => {
  const lastUpdated = "1 September 2026";

  return (
    <>
      <SEO
        title="Accessibility Statement"
        description="Basha Lagbe is committed to making our property rental platform accessible to everyone, including users with disabilities. Learn about our accessibility standards and how to report issues."
        url="/accessibility"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-16 px-4">
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
              <div className="bg-green-100 p-3 rounded-2xl">
                <EyeIcon className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Accessibility Statement</h1>
                <p className="text-gray-500 text-sm mt-1">Last updated: {lastUpdated}</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-900">
              Basha Lagbe is committed to making our platform accessible to all users, including
              those with disabilities. We strive to meet WCAG 2.1 Level AA standards.
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >
            <Section title="Our Commitment">
              <p>
                Basha Lagbe is dedicated to providing a digital experience that is accessible to all
                people, regardless of disability status, assistive technology, or browsing environment.
                We believe that finding a home should be possible for everyone.
              </p>
              <p>
                We are actively working to achieve conformance with the Web Content Accessibility
                Guidelines (WCAG) 2.1 at Level AA across our entire platform.
              </p>
            </Section>

            <Section title="What We're Doing">
              <p>We have implemented or are working towards the following accessibility features:</p>
              <ul className="space-y-2 mt-3">
                {commitments.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Known Limitations">
              <p>
                Despite our best efforts, some areas of our platform may not yet fully meet WCAG 2.1
                AA standards. We are actively working to identify and resolve these issues. Known areas
                requiring improvement include:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Some map-based property search features may have limited screen reader support.</li>
                <li>Third-party authentication (Google Sign-In) may have varying accessibility depending on the provider.</li>
                <li>Dynamically loaded content in image galleries may not always announce to screen readers.</li>
              </ul>
            </Section>

            <Section title="Technical Standards">
              <p>Our platform is built using the following accessibility standards and specifications:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>WCAG 2.1 Level AA</strong> — Web Content Accessibility Guidelines
                </li>
                <li>
                  <strong>WAI-ARIA 1.2</strong> — Accessible Rich Internet Applications
                </li>
                <li>
                  <strong>HTML5 Semantic Markup</strong> — Correct use of landmarks, headings, and roles
                </li>
              </ul>
            </Section>

            <Section title="Assistive Technologies We Test With">
              <ul className="list-disc pl-5 space-y-1">
                <li>NVDA (Windows) screen reader</li>
                <li>TalkBack (Android) screen reader</li>
                <li>VoiceOver (iOS / macOS) screen reader</li>
                <li>Keyboard-only navigation (Tab, Shift+Tab, Enter, Escape, arrow keys)</li>
                <li>Browser zoom up to 200%</li>
              </ul>
            </Section>

            <Section title="Reporting Accessibility Issues">
              <p>
                We welcome your feedback on the accessibility of Basha Lagbe. If you encounter any
                accessibility barrier, please let us know so we can address it promptly.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mt-2">
                <p className="font-semibold text-gray-900">Contact our Accessibility Team</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:accessibility@bashalagbe.com"
                    className="text-indigo-600 hover:underline"
                  >
                    accessibility@bashalagbe.com
                  </a>
                </p>
                <p>
                  Support:{" "}
                  <a
                    href="mailto:support@bashalagbe.com"
                    className="text-indigo-600 hover:underline"
                  >
                    support@bashalagbe.com
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  We aim to respond to accessibility feedback within 5 business days.
                </p>
              </div>
            </Section>

            <Section title="Formal Complaints">
              <p>
                If you are not satisfied with our response, you have the right to raise your concern
                with a relevant supervisory authority in Bangladesh or your country of residence.
              </p>
            </Section>
          </motion.div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Also see our{" "}
            <Link to="/privacy-policy" className="text-indigo-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to="/terms" className="text-indigo-600 hover:underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default Accessibility;
