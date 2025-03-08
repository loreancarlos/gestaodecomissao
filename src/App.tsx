import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Clients } from "./pages/Clients";
import { Developments } from "./pages/Developments";
import { Sales } from "./pages/Sales";
import { Users } from "./pages/Users";
import { Commissions } from "./pages/Commissions";
import { useAuthStore } from "./store/authStore";
import { PrivateRoute } from "./components/routing/PrivateRoute";
import { AuthRoute } from "./components/routing/AuthRoute";

export function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route - Login */}
        <Route
          path="/"
          element={
            <AuthRoute requireAuth={false}>
              <Login />
            </AuthRoute>
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <AuthRoute>
              <Layout />
            </AuthRoute>
          }>
          {/* Admin and regular user routes */}
          <Route
            path="/clients"
            element={
              <PrivateRoute requireAdmin>
                <Clients />
              </PrivateRoute>
            }
          />
          <Route
            path="/developments"
            element={
              <PrivateRoute requireAdmin>
                <Developments />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute requireAdmin>
                <Sales />
              </PrivateRoute>
            }
          />

          {/* Broker only route */}
          <Route
            path="/commissions"
            element={
              <PrivateRoute requireBroker requireTeamLeader>
                <Commissions />
              </PrivateRoute>
            }
          />

          {/* Admin only route */}
          <Route
            path="/users"
            element={
              <PrivateRoute requireAdmin>
                <Users />
              </PrivateRoute>
            }
          />

          {/* Catch all route - redirect to appropriate page based on role */}
          <Route
            path="*"
            element={
              user?.role === "broker" || user?.role === "teamLeader" ? (
                <Navigate to="/commissions" replace />
              ) : (
                <Navigate to="/clients" replace />
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
