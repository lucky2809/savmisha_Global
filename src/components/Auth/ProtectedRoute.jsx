import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import CircularProgress from "@mui/material/CircularProgress";

 const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="w-full h-screen flex justify-center items-center"><CircularProgress sx={{color:"#f0b100"}} size={"3.5rem"} /></div>;

  // if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute
