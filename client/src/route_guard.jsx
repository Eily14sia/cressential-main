import { useAuth } from './context2';
import { Navigate, Route } from 'react-router-dom';

const RouteGuard = ({ role, ...props }) => {
  // Retrieve the user_role from localStorage
  const user_role = localStorage.getItem('user_role');

  // Check if the user's role matches the required role for the route
  if (user_role === role) {
    return <Route {...props} />;
  } else {
    // Redirect to a different route (e.g., unauthorized or home) only if the user's role doesn't match
    return user_role ? null : <Navigate to="/unauthorized" />;
  }
};

export default RouteGuard;
