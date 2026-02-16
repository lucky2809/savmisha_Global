import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import useUserStore from "../../store/userStore";
import { useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // const [user, setUser] = useState(null);
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const [loading, setLoading] = useState(true); // ⬅️ new 
    const location = useLocation(); 


    const fetchVerifyToken = async (token, user) => {
        if(user) return
        try {
            const fetchData = await fetch(`${import.meta.env.VITE_API_URL}/verify-token/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await fetchData.json();
            setUser(data.user_data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false); // ⬅️ done verifying
        }
    };

    useLayoutEffect(() => {
        
        const token = localStorage.getItem("access_token");
        if (token) {
            fetchVerifyToken(token, user);
        } else {
            setUser(null);
            setLoading(false); // ⬅️ no token, stop loading
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
