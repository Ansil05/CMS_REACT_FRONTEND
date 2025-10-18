import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
