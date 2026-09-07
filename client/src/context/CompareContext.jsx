import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ToastContext } from '../components/Toast';

const CompareContext = createContext(null);
const STORAGE_KEY = 'basha_lagbe_compare_v1';
const MAX_COMPARE = 4;

export const CompareProvider = ({ children }) => {
  const toast = useContext(ToastContext);
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
    } catch (e) {
      console.warn('Failed to save comparison state to localStorage', e);
    }
  }, [compareList]);

  const addToCompare = useCallback((property) => {
    if (!property || !property._id) return;
    setCompareList((prev) => {
      if (prev.some((p) => p._id === property._id)) {
        toast?.info?.('Property is already in your comparison list');
        return prev;
      }
      if (prev.length >= MAX_COMPARE) {
        toast?.warning?.(`You can compare up to ${MAX_COMPARE} properties at once.`);
        return prev;
      }
      toast?.success?.(`Added "${property.title || 'Property'}" to comparison`);
      return [...prev, property];
    });
  }, [toast]);

  const removeFromCompare = useCallback((propertyId) => {
    setCompareList((prev) => {
      const next = prev.filter((p) => p._id !== propertyId);
      if (next.length === 0) {
        setIsCompareOpen(false);
      }
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    setIsCompareOpen(false);
    toast?.info?.('Cleared comparison list');
  }, [toast]);

  const isInCompare = useCallback(
    (propertyId) => {
      return compareList.some((p) => p._id === propertyId);
    },
    [compareList]
  );

  const toggleCompare = useCallback(
    (property) => {
      if (!property) return;
      if (isInCompare(property._id)) {
        removeFromCompare(property._id);
        toast?.info?.('Removed from comparison');
      } else {
        addToCompare(property);
      }
    },
    [isInCompare, removeFromCompare, addToCompare, toast]
  );

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        toggleCompare,
        isCompareOpen,
        setIsCompareOpen,
        maxCompare: MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export default CompareContext;
