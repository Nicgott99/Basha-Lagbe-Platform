import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { DocumentTextIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import SEO from "../components/SEO";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-3 border-l-4 border-yellow-400 pl-4">
      {title}
    </h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const Terms = () => {
  const lastUpdated = "1 September 2026";

  return (
    <>
      <SEO
        title="Terms of Service"
        description="Read the Terms of Service for Basha Lagbe. Understand your rights and responsibilities when using our property rental platform in Bangladesh."
        url="/terms"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50 py-16 px-4">
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
              <div className="bg-yellow-100 p-3 rounded-2xl">
                <DocumentTextIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-gray-500 text-sm mt-1">Last updated: {lastUpdated}</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-900">
              Please read these terms carefully before using Basha Lagbe. By accessing or using
              our platform, you agree to be bound by these Terms of Service.
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-8 md:p-12"
          >
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using the Basha Lagbe website and services ("Platform"), you agree to
                be bound by these Terms of Service and all applicable laws and regulations. If you do
                not agree with any of these terms, you are prohibited from using the Platform.
              </p>
            </Section>

            <Section title="2. Eligibility">
              <p>
                You must be at least 18 years of age to use this Platform. By using Basha Lagbe,
                you represent and warrant that you are 18 or older, have the legal capacity to enter
                into a binding agreement, and are not prohibited by any applicable law from using
                this Platform.
              </p>
            </Section>

            <Section title="3. Account Registration">
              <ul className="list-disc pl-5 space-y-1">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You agree to provide accurate, current, and complete information during registration.</li>
                <li>
                  You are responsible for all activities that occur under your account. Notify us
                  immediately of any unauthorized use at{" "}
                  <a href="mailto:support@bashalagbe.com" className="text-indigo-600 hover:underline">
                    support@bashalagbe.com
                  </a>
                  .
                </li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
              </ul>
            </Section>

            <Section title="4. Listings and Content">
              <p>
                Landlords who post property listings are solely responsible for the accuracy of their
                listings. By posting a listing, you represent and warrant that:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You own or are authorized to rent the property described.</li>
                <li>All listing information is accurate and not misleading.</li>
                <li>The listing does not violate any applicable laws or regulations.</li>
                <li>Property photos are genuine representations of the actual property.</li>
              </ul>
              <p>
                Basha Lagbe reserves the right to remove any listing that violates these terms or
                our community guidelines.
              </p>
            </Section>

            <Section title="5. Prohibited Uses">
              <p>You agree not to use the Platform to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Post false, inaccurate, or misleading listings.</li>
                <li>Discriminate against users based on race, religion, gender, nationality, or disability.</li>
                <li>Engage in fraudulent activities or scams.</li>
                <li>Collect personal data about other users without their consent.</li>
                <li>Use automated tools (bots, scrapers) to access the Platform without permission.</li>
                <li>Violate any applicable Bangladeshi or international laws.</li>
              </ul>
            </Section>

            <Section title="6. Fees and Payments">
              <p>
                Basha Lagbe is currently free to use for both landlords and tenants. We reserve the
                right to introduce premium features or subscription plans in the future. We will
                notify registered users at least 30 days before introducing any mandatory charges.
              </p>
            </Section>

            <Section title="7. Disclaimer of Warranties">
              <p>
                The Platform is provided on an "as is" and "as available" basis without any warranties
                of any kind, express or implied. Basha Lagbe does not warrant that:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The Platform will be uninterrupted, error-free, or secure.</li>
                <li>Listings are verified (though we make efforts to do so).</li>
                <li>Any information on the Platform is accurate or complete.</li>
              </ul>
            </Section>

            <Section title="8. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, Basha Lagbe shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages arising from your
                use of, or inability to use, the Platform or any transaction conducted through it.
              </p>
            </Section>

            <Section title="9. Governing Law">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                People's Republic of Bangladesh. Any disputes arising from these Terms shall be
                resolved in the courts of Dhaka, Bangladesh.
              </p>
            </Section>

            <Section title="10. Changes to Terms">
              <p>
                We reserve the right to modify these Terms at any time. Material changes will be
                communicated via email to registered users and by updating the "Last Updated" date
                above. Continued use of the Platform after changes constitutes acceptance of
                the new terms.
              </p>
            </Section>

            <Section title="11. Contact">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-semibold text-gray-900">Basha Lagbe Legal Team</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:legal@bashalagbe.com"
                    className="text-indigo-600 hover:underline"
                  >
                    legal@bashalagbe.com
                  </a>
                </p>
                <p>Address: Dhaka, Bangladesh</p>
              </div>
            </Section>
          </motion.div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Also see our{" "}
            <Link to="/privacy-policy" className="text-indigo-600 hover:underline">
              Privacy Policy
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

export default Terms;
