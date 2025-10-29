import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext({
  role: '',
  setRole: () => {},
});

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('');

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
export default RoleContext;