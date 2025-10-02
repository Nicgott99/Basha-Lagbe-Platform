import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Redirect to sign-in if not authenticated
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }
  
  // Redirect to user dashboard if not admin
  if (currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <Outlet />;
}