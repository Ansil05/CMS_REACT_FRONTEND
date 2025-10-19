import { Navigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { role } = useRole();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;
