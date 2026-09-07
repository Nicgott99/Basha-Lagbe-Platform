import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

const CompareFloatingBar = () => {
  const { compareList, removeFromCompare, clearCompare, setIsCompareOpen, maxCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        aria-label="Property comparison tray"
        className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-gray-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-2xl border border-gray-700/60"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Left: Info & Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <div className="flex items-center gap-1.5 bg-primary-600/30 text-primary-300 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border border-primary-500/30">
              <Scale className="w-3.5 h-3.5" />
              <span>Compare ({compareList.length}/{maxCompare})</span>
            </div>

            <div className="flex items-center gap-2">
              {compareList.map((property) => {
                const img = property.imageUrls?.[0] || property.images?.[0] || '/api/placeholder/100/100';
                return (
                  <div
                    key={property._id}
                    className="relative group flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-gray-600 bg-gray-800"
                    title={property.title}
                  >
                    <img
                      src={img}
                      alt={property.title || 'Property thumbnail'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCompare(property._id);
                      }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                      title="Remove from comparison"
                      aria-label={`Remove ${property.title || 'property'} from comparison`}
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={clearCompare}
              className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-gray-800/80 transition-colors"
              title="Clear all"
              aria-label="Clear all compared properties"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default CompareFloatingBar;
