import React from "react";
import { BrowserRouter, Routes, Route, useNavigate,Navigate } from "react-router-dom";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';

function SignUpPage() {
  const navigate = useNavigate();
  return <SignUp onSignupSuccess={() => navigate("/signin")} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
