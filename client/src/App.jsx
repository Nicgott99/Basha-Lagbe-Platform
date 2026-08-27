import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import About from "./pages/About";
import Profile from "./pages/Profile";
import AddProperty from "./pages/AddProperty";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoute from "./components/PrivateRoute";
import Applications from "./pages/Applications";
import Inquiries from "./pages/Inquiries";
import Notifications from "./pages/Notifications";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import OfflineBanner from "./components/OfflineBanner";
import ReadingProgressBar from "./components/ReadingProgressBar";
import useCrossTabSync from "./hooks/useCrossTabSync";

/**
 * AppRoutes — inner component that lives inside BrowserRouter.
 * Must be a separate component so that hooks requiring router context
 * (useNavigate, useLocation) can be called here rather than in App.
 */
function AppRoutes() {
  const { currentUser } = useSelector((state) => state.user);

  // Sync auth state across browser tabs — signs out all tabs when one signs out
  useCrossTabSync();

  return (
    <>
      <OfflineBanner />
      {/* ReadingProgressBar: thin gradient line at top that fills as user scrolls */}
      <ReadingProgressBar />
      <ScrollToTop />
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={currentUser ? (currentUser.role === 'admin' ? <AdminPanel /> : <Dashboard />) : <Landing />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* User Routes */}
        <Route element={<UserRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<AddProperty />} />
          <Route path="/add-property" element={<AddProperty />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin-dashboard" element={<AdminPanel />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/inquiries" element={<Inquiries />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* 404 — catch-all for any unmatched route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
