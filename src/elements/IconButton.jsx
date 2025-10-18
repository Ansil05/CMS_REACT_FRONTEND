import React from 'react';

export default function IconButton({ icon, onClick, className = '' }) {
  return (
    <button className={`icon-button ${className}`} onClick={onClick}>
      {icon}
    </button>
  );
}
