import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";

/* Components */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Button from "./components/Button";

/* Pages */
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import ContactSummary from "./pages/ContactSummary";
import Customers from "./pages/Customers";
import CustomerSummary from "./pages/CustomerSummary";
import Deals from "./pages/Deals";
import DealSummary from "./pages/DealSummary";
import Profile from "./pages/Profile";
import { UserContext } from "./context/userContext";

/* =========================
   ProtectedRoute (inline)
========================= */
const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useContext(UserContext);
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Outlet /> : navigate('/login');
};

/* =========================
   App Layout (inline)
========================= */
const AppLayout = () => (
  <>
    <Navbar />
    <main style={{ padding: "24px", paddingBottom: "80px" }}>
      <Outlet />
    </main>
    <Footer />
  </>
);

/* =========================
   Main App
========================= */
const App = () => {

  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />

              <Route path="/contacts" element={<Contacts />} />
              <Route path="/contacts/:id" element={<ContactSummary />} />

              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerSummary />} />

              <Route path="/deals" element={<Deals />} />
              <Route path="/deals/:id" element={<DealSummary />} />

              <Route path="/profile" element={<Profile />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
};

export default App;
