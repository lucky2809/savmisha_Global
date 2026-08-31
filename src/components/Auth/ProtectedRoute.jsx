import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Spinner } from "../Admin/ui";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  // Rendering null here showed a blank white page for as long as the
  // token check took, which read as a broken app.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <Spinner className="h-7 w-7" />
          <p className="text-sm">Checking your session...</p>
        </div>
      </div>
    );
  }

  // `replace` keeps the protected URL out of history, and `state` lets the
  // login page send the user back where they were headed.
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
