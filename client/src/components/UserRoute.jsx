import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function UserRoute() {
  const { currentUser } = useSelector((state) => state.user);
  
  // Allow access only to authenticated users with 'user' role
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }
  
  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  
  if (currentUser.role !== 'user') {
    return <Navigate to="/sign-in" />;
  }
  
  return <Outlet />;
}