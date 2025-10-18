import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div>© {new Date().getFullYear()} Clinical Management System</div>
    </footer>
  );
}
