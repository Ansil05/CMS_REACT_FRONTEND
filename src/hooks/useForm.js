import { useState } from 'react';

export default function useForm(initial = {}) {
  const [values, setValues] = useState(initial);
  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }
  return { values, setValues, handleChange };
}
