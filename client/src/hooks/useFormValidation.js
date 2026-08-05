import { useState, useCallback } from "react";

/**
 * useFormValidation
 * A reusable form state + validation hook that eliminates the repeated
 * formData, errors, handleChange, validate patterns across every page.
 *
 * @param {Object} initialValues - Initial field values: { email: '', password: '', ... }
 * @param {Object} validationRules - Validator functions keyed by field name:
 *   { email: (value) => !value ? 'Email is required' : '', ... }
 *   Each validator receives the current field value AND the full formData object.
 *   Return an empty string '' for "valid", or an error message string for "invalid".
 *
 * @returns {{
 *   formData: Object,
 *   errors: Object,
 *   isValid: boolean,
 *   isDirty: boolean,
 *   handleChange: (e: Event) => void,
 *   handleBlur: (e: Event) => void,
 *   setFieldValue: (name: string, value: any) => void,
 *   validateField: (name: string) => string,
 *   validateAll: () => boolean,
 *   resetForm: () => void,
 *   resetErrors: () => void,
 * }}
 *
 * @example
 *   const { formData, errors, handleChange, validateAll } = useFormValidation(
 *     { email: '', password: '' },
 *     {
 *       email:    (v) => !v ? 'Email is required' : !/\S+@\S+\.\S+/.test(v) ? 'Invalid email' : '',
 *       password: (v) => !v ? 'Password is required' : v.length < 6 ? 'Min 6 characters' : '',
 *     }
 *   );
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     if (!validateAll()) return;   // shows all field errors at once
 *     // ... submit
 *   };
 */
const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});   // tracks which fields were touched
  const [isDirty, setIsDirty]   = useState(false); // true after any field is edited

  /** Run the validator for a single named field; returns the error string */
  const validateField = useCallback(
    (name) => {
      const rule = validationRules[name];
      if (!rule) return "";
      return rule(formData[name], formData) || "";
    },
    [formData, validationRules]
  );

  /**
   * handleChange — standard React onChange handler.
   * Works for input, select, and textarea elements.
   * Also clears the field's error once the user starts correcting it.
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setIsDirty(true);

    // Clear the error live as the user types (re-validate if already touched)
    setErrors((prev) => {
      if (!touched[name]) return prev;
      const rule = validationRules[name];
      const err  = rule ? rule(newValue, { ...formData, [name]: newValue }) || "" : "";
      return { ...prev, [name]: err };
    });
  }, [formData, touched, validationRules]);

  /**
   * handleBlur — validate a field when it loses focus.
   * This follows standard UX: errors appear after the user leaves a field.
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const rule = validationRules[name];
    const err  = rule ? rule(formData[name], formData) || "" : "";
    setErrors((prev) => ({ ...prev, [name]: err }));
  }, [formData, validationRules]);

  /** Programmatically set a single field value (useful for selects / custom inputs) */
  const setFieldValue = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  }, []);

  /**
   * validateAll — run all validators at once and update the errors object.
   * Returns true if every field is valid, false otherwise.
   * Use this in form onSubmit handlers.
   */
  const validateAll = useCallback(() => {
    const newErrors = {};
    let valid = true;

    for (const name of Object.keys(validationRules)) {
      const err = validationRules[name](formData[name], formData) || "";
      if (err) {
        newErrors[name] = err;
        valid = false;
      }
    }

    setErrors(newErrors);
    // Mark all fields as touched so errors are visible
    setTouched(
      Object.keys(validationRules).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    return valid;
  }, [formData, validationRules]);

  /** Reset form to initial values, clear all errors and dirty state */
  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialValues]);

  /** Clear error messages without resetting form data */
  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  // isValid: true when every rule passes on the current formData (used for button states)
  const isValid = Object.keys(validationRules).every((name) => {
    const rule = validationRules[name];
    return !rule || !rule(formData[name], formData);
  });

  return {
    formData,
    errors,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    setFieldValue,
    validateField,
    validateAll,
    resetForm,
    resetErrors,
  };
};

export default useFormValidation;
