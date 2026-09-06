import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircleIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import SEO from "../components/SEO";

const messages = {
  application: {
    title: "Application Submitted!",
    subtitle: "Your rental application has been sent to the landlord.",
    body: "The property owner will review your application and get back to you within 1-3 business days. We will send a confirmation to your email address.",
    icon: CheckCircleIcon,
    color: "from-emerald-500 to-teal-500",
    bg: "from-emerald-50 to-teal-50",
  },
  contact: {
    title: "Message Sent!",
    subtitle: "We have received your inquiry.",
    body: "Our team will respond to your message within 24 hours. Please check your email (including your spam folder) for a confirmation.",
    icon: EnvelopeIcon,
    color: "from-blue-500 to-indigo-500",
    bg: "from-blue-50 to-indigo-50",
  },
  listing: {
    title: "Listing Submitted!",
    subtitle: "Your property has been submitted for review.",
    body: "Our team will verify your listing details and publish it within 24-48 hours. You will receive an email confirmation once it goes live.",
    icon: HomeIcon,
    color: "from-purple-500 to-pink-500",
    bg: "from-purple-50 to-pink-50",
  },
  default: {
    title: "Thank You!",
    subtitle: "Your request has been received.",
    body: "We will get back to you as soon as possible. In the meantime, feel free to explore our property listings.",
    icon: CheckCircleIcon,
    color: "from-indigo-500 to-blue-500",
    bg: "from-indigo-50 to-blue-50",
  },
};

const ThankYou = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "default";
  const msg = messages[type] || messages.default;
  const Icon = msg.icon;

  return (
    <>
      <SEO
        title={msg.title}
        description={msg.subtitle}
        noIndex={true}
      />

      <div className={`min-h-screen bg-gradient-to-br ${msg.bg} flex items-center justify-center px-4 py-16`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="max-w-lg w-full text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${msg.color} shadow-2xl mb-8`}
          >
            <Icon className="w-12 h-12 text-white" strokeWidth={1.5} />
          </motion.div>

          {/* Confetti dots */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `hsl(${i * 30}, 80%, 60%)`,
                left: `${20 + i * 5}%`,
                top: `${30 + (i % 4) * 10}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                y: [-20, -60, -20],
              }}
              transition={{ delay: 0.3 + i * 0.05, duration: 1.5 }}
            />
          ))}

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-3"
            >
              {msg.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg font-medium text-gray-700 mb-4"
            >
              {msg.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 mb-8 leading-relaxed"
            >
              {msg.body}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
              >
                <HomeIcon className="w-5 h-5" />
                Go to Home
              </button>
              <button
                onClick={() => navigate("/search")}
                className="flex items-center justify-center gap-2 flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                Browse Properties
              </button>
            </motion.div>
          </div>

          <p className="text-gray-400 text-sm mt-6">
            Questions? Email us at{" "}
            <a
              href="mailto:support@bashalagbe.com"
              className="text-indigo-600 hover:underline"
            >
              support@bashalagbe.com
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default ThankYou;
