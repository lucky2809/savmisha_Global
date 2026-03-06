import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return null;

  if (token) return <Navigate to="/" />;

  return children;
};

export default PublicRoute;