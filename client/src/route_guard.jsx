import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RouteGuard = ({ route }) => {
  // Get the user's role from local storage or your authentication context
  const userRole = localStorage.getItem('user_role'); // Update this to your actual implementation

  if (!userRole || userRole !== route.requiredRole) {
    // Redirect to an unauthorized page or handle the error as needed
    return <Navigate to="/unauthorized" />;
  }

  // Render the route's content if the user has the required role
  return <Outlet />;
};

export default RouteGuard;
