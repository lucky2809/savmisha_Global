// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import useUserStore from "../../store/userStore";
import { api } from "../../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, token, setAuth, logout } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // The store persists under "auth-storage"; the older code also wrote a bare
    // "access_token" key. Read both so an existing session is not dropped.
    const storedToken = token || localStorage.getItem("access_token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    api
      .get("/verify-token/", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((data) => {
        if (cancelled) return;
        if (data?.user_data) {
          setAuth(data.user_data, storedToken);
        }
      })
      .catch((err) => {
        if (cancelled) return;

        // A rejected token is a real logout: keeping it left the UI looking
        // signed in while every subsequent request 401'd. A network/server
        // failure is not, so the session survives that.
        const rejected = /^(401|403)\b|Invalid or expired token|Authorization header missing/i.test(
          err.message || ""
        );

        if (rejected) {
          logout();
        } else {
          console.warn("verify-token unreachable, session preserved:", err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
