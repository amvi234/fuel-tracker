import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryProvider from "./providers/queryProvider";
import { AuthProvider } from "./providers";
import Register from "./components/pages/Auth/Register";
import { AuthGuard } from "./components/guards";
import Product from "./components/pages/dashboard/Product";
import Login from "./components/pages/Auth/Login";

const App: React.FC = () => {
  return (
    <QueryProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route path="/product" element={<Product />} />
            </Route>
          </Routes>
        </Router>

        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </QueryProvider>
  );
};

export default App;
