// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import useUserStore from "../../store/userStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, token, setAuth, logout } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = token || localStorage.getItem("access_token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    // ✅ soft verify (no auto logout)
    fetch(`${import.meta.env.VITE_API_URL}/verify-token/`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data?.user_data) {
          setAuth(data.user_data, storedToken);
        }
      })
      .catch(() => {
        // ❗ no forced logout
        console.warn("verify-token failed, session preserved");
      })
      .finally(() => setLoading(false));

  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);