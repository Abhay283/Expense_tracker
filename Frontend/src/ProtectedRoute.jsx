import React,{useEffect} from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user,login,logout } = useAuth();
 const navigate = useNavigate();

//  useEffect(() => {
//     // ✅ If no user but token exists, auto-login from token
//     const token = localStorage.getItem("token");
//     if (token && !user) {
//       // optionally decode or verify token here
//       login("user@email.com"); // placeholder (you can decode actual email)
//     }

//     // ❌ if neither token nor user, redirect
//     if (!token && !user) {
//       logout();
//       navigate("/signin");
//     }
//   }, [user, login, logout, navigate]);

  if (!user && !localStorage.getItem("token")) {
    return <Navigate to="/signin" replace />; 
  }

  return children; 
}
