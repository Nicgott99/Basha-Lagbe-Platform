import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HomeIcon, MagnifyingGlassIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  const navigate = useNavigate();

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (i * 37 + 13) % 100,
    y: (i * 53 + 7) % 100,
    size: (i % 3) * 3 + 5,
    delay: (i * 0.3) % 2,
    duration: (i % 3) + 2.5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden px-4">

      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-white opacity-10"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: dot.duration, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400 rounded-full blur-3xl opacity-15 pointer-events-none" />

      <motion.div
        className="relative z-10 text-center max-w-2xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex justify-center mb-8" variants={itemVariants}>
          <motion.div variants={floatVariants} animate="animate" className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-2xl opacity-40 scale-110" />
            <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-3xl shadow-2xl border border-white/10">
              <HomeIcon className="w-20 h-20 text-white" strokeWidth={1.5} />
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} className="relative mb-4">
          <span className="text-9xl sm:text-[11rem] font-black leading-none bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent select-none">
            404
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl font-bold text-white mb-3">
          ???? ?????? ??? ??!
        </motion.h1>

        <motion.p variants={itemVariants} className="text-indigo-200 text-base sm:text-lg mb-2 font-medium">
          This page does not exist — just like your dream home that is still waiting. ??
        </motion.p>
        <motion.p variants={itemVariants} className="text-indigo-300/70 text-sm sm:text-base mb-10">
          The page you are looking for may have been moved, deleted, or never existed.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-purple-500/30 transition-all duration-200"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </motion.button>

          <motion.button
            onClick={() => navigate("/search")}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 rounded-2xl border border-white/20 backdrop-blur-sm transition-all duration-200"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            Search Properties
          </motion.button>

          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 text-indigo-300 hover:text-white font-medium px-6 py-3.5 rounded-2xl hover:bg-white/5 transition-all duration-200"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Go Back
          </motion.button>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-12 text-indigo-400/50 text-xs">
          Basha Lagbe — Find your perfect home in Bangladesh
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
