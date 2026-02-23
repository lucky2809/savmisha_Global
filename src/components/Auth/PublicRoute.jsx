import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    // ✅ agar token/user hai → login par jaane hi na de
    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;