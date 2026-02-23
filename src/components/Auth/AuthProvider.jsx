// AuthContext.jsx
import { createContext, useContext, useLayoutEffect, useState } from "react";
import useUserStore from "../../store/userStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const [loading, setLoading] = useState(true);

    const fetchVerifyToken = async (token) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/verify-token/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data?.user_data) {
                setUser(data.user_data);
            } else {
                setUser(null);
                localStorage.removeItem("access_token");
            }
        } catch (err) {
            setUser(null);
            localStorage.removeItem("access_token");
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            fetchVerifyToken(token);
        } else {
            setUser(null);
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);