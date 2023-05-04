import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useDebounce } from './useDebounce';

interface Validation {
  required?: {
    value: boolean;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
  custom?: {
    isValid: (value: string) => boolean;
    message: string;
  };
}
type Errors<T> = Partial<Record<keyof T, string>>;

function useFormValidation<T>({
  validations,
  initial,
}: {
  validations: Partial<Record<keyof T, Validation>>;
  initial?: Partial<T>;
}) {
  const [data, setData] = useState<T>((initial || {}) as T);
  const [errors, setErrors] = useState<Errors<T>>({});
  const { debounce } = useDebounce();

  const handleChange = (key: keyof T, fn?: (params: string) => void) => (value: string) => {
    delete errors[key];
    if (fn) {
      debounce(() => fn(value), 500);
    }
    setData({
      ...data,
      [key]: value,
    });
  };
  const validate = useCallback((validation: Validation | undefined, value: string) => {
    if (validation?.required?.value && !value) {
      return validation?.required?.message;
    }
    const pattern = validation?.pattern;
    if (pattern?.value && !pattern?.value.test(value)) {
      return pattern.message;
    }
    const custom = validation?.custom;
    if (custom?.isValid && !custom.isValid(value)) {
      return custom.message;
    }
    return null;
  }, []);

  const handleBlur = (key: keyof T) => () => {
    const newErrors: Errors<T> = { ...errors } || {};
    const value = data[key] as string;
    const validation = validations[key];
    const errorContent = validate(validation, value);
    if (errorContent) {
      newErrors[key] = errorContent;
      setErrors(newErrors);
    }
    // if (!newErrors[key]) {
    //     const value = data[key];
    //     const validation = validations[key];
    //     delete newErrors[key];
    //     validate(validation, value);
    //   }
  };
  const handleSubmit = (fn: Function) => {
    const newErrors: Errors<T> = { ...errors } || {};
    for (const key in data) {
      const value = data[key] as string;
      const validation = validations[key];
      const errorContent = validate(validation, value);
      if (errorContent) {
        newErrors[key] = errorContent;
        setErrors(newErrors);
      }
    }
    if (Object.keys(newErrors).length === 0) {
      fn();
    }
  };

  return { data, handleChange, errors, setErrors, handleSubmit, handleBlur };
}

export default useFormValidation;
