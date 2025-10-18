import React from 'react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb">
      {items.map((it, idx) => (
        <span key={idx}>{it}</span>
      ))}
    </nav>
  );
}
