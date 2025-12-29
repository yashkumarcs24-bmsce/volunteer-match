import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const toggleDark = () => {
    setDark((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(false);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    } else {
      setUser(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner-large"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,   // ✅ NOW AVAILABLE
        loading,
        login,
        logout,
        updateUser,
        dark,
        setDark,
        toggleDark,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
