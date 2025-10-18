import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [message, setMessage] = useState(null);
  function notify(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }
  return (
    <NotificationContext.Provider value={{ message, notify }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotificationContext = () => useContext(NotificationContext);

export default NotificationContext;
