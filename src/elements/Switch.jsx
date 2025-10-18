import React from 'react';

export default function Switch({ checked, onChange }) {
  return <input type="checkbox" checked={checked} onChange={onChange} />;
}
