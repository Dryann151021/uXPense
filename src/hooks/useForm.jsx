import { useCallback, useState } from 'react';

export function useForm(initialValues) {
  const [form, setForm] = useState(initialValues);

  const handleChange = useCallback((event) => {
    const { name, type, checked, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const resetForm = useCallback(
    (nextValues = initialValues) => {
      setForm(nextValues);
    },
    [initialValues],
  );

  return { form, setForm, handleChange, resetForm };
}
