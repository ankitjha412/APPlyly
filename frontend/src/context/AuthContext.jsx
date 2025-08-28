// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/api";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       api.get("/auth/me")
//         .then((res) => setUser(res.data.user))
//         .catch(() => {
//           localStorage.removeItem("token");
//           setUser(null);
//         });
//     }
//   }, []);

//   const login = async (email, password) => {
//     const res = await api.post("/auth/login", { email, password });
//     localStorage.setItem("token", res.data.token);
//     setUser(res.data.user);
//     navigate("/applications");
//   };

//   const signup = async (formData) => {
//     const res = await api.post("/auth/signup", formData);
//     localStorage.setItem("token", res.data.token);
//     setUser(res.data.user);
//     navigate("/applications");
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     navigate("/auth");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }



import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    navigate("/applications");
  };

  const signup = async (formData) => {
    const res = await api.post("/auth/signup", formData);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    navigate("/applications");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
