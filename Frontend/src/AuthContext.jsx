import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, token) => {
    localStorage.setItem("token", token);
    setUser({ email });
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // ✅ check token on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser({ email: decoded.email });
      }catch{
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);