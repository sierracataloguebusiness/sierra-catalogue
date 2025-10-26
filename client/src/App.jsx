import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./component/Navbar/Navbar.jsx";
import Footer from "./component/Footer/Footer.jsx";
import ScrollToTop from "./component/ScrollToTop.jsx";
import PrivateRoute from "./component/ProtectedRoute.jsx";
import { ToastContainer, Slide } from "react-toastify";

// Layout
import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Shop from "./pages/shop/Shop.jsx";
import ProductDetail from "./pages/shop/ProductDetail.jsx";
import Blog from "./pages/blog/Blog.jsx";
import BlogDetail from "./pages/blog/BlogDetail.jsx";
import Contact from "./pages/contact/Contact.jsx";
import Cart from "./pages/shop/Cart.jsx";
import Checkout from "./pages/shop/CheckOut.jsx";
import VendorGuideline from "./pages/vendor/VendorGuideline.jsx";
import VendorApplicationForm from "./pages/vendor/VendorApplicationForm.jsx";
import FAQ from "./pages/FAQ.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import AccessDenied from "./pages/AccessDenied.jsx";
import NotFound from "./pages/NotFound.jsx";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import AdminPanel from "./pages/dashboard/admin/AdminPanel.jsx";
import AdminManageUsers from "./pages/dashboard/admin/AdminManageUsers.jsx";
import AdminManageVendors from "./pages/dashboard/admin/AdminManageVendors.jsx";
import AdminManageVendorApplications from "./pages/dashboard/admin/AdminManageVendorApplications.jsx";
import AdminSettings from "./pages/dashboard/admin/AdminSettings.jsx";
import ProfilePage from "./pages/dashboard/ProfilePage.jsx";
import VendorDashboard from "./pages/dashboard/vendor/VendorDashboard.jsx";
import VendorProduct from "./pages/dashboard/vendor/VendorProduct.jsx";
import VendorShop from "./pages/dashboard/vendor/VendorShop.jsx";
import VendorOrder from "./pages/dashboard/vendor/VendorOrder.jsx";
import CustomerOrder from "./pages/dashboard/customer/CustomerOrder.jsx";
import CustomerFavorite from "./pages/dashboard/customer/CustomerFavorite.jsx";

const App = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />

      <ScrollToTop />

      {!isDashboardRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/product/:id" element={<ProductDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/deals" element={<ComingSoon />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/vendor-guidelines" element={<VendorGuideline />} />
        <Route path="/vendor-application" element={<VendorApplicationForm />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/403" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />

        {/* Cart & Checkout (Protected) */}
        <Route
          path="/cart"
          element={
            <PrivateRoute allowedRoles={["customer", "vendor"]}>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute allowedRoles={["customer", "vendor"]}>
              <Checkout />
            </PrivateRoute>
          }
        />

        {/* Dashboard Layout (Protected) */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Default dashboard */}
          <Route index element={<Dashboard />} />

          {/* Admin Routes */}
          <Route
            path="admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminManageUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/vendors"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminManageVendors />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/vendor-application"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminManageVendorApplications />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/settings"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminSettings />
              </PrivateRoute>
            }
          />

          {/* Vendor Routes */}
          <Route
            path="vendor"
            element={
              <PrivateRoute allowedRoles={["vendor"]}>
                <VendorDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="vendor/shop"
            element={
              <PrivateRoute allowedRoles={["vendor"]}>
                <VendorShop />
              </PrivateRoute>
            }
          />

          <Route
            path="vendor/products"
            element={
              <PrivateRoute allowedRoles={["vendor"]}>
                <VendorProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="vendor/orders"
            element={
              <PrivateRoute allowedRoles={["vendor"]}>
                <VendorOrder />
              </PrivateRoute>
            }
          />

          <Route
            path="vendor/settings"
            element={
              <PrivateRoute allowedRoles={["vendor"]}>
                <ComingSoon />
              </PrivateRoute>
            }
          />

          {/* Customer Routes */}
          <Route path="customer" element={<Dashboard />} />
          <Route
            path="customer/orders"
            element={
              <PrivateRoute allowedRoles={["customer"]}>
                <CustomerOrder />
              </PrivateRoute>
            }
          />
          <Route
            path="customer/favorites"
            element={
              <PrivateRoute allowedRoles={["customer"]}>
                <CustomerFavorite />
              </PrivateRoute>
            }
          />
          <Route path="customer/settings" element={<div>Settings</div>} />

          {/* General Routes */}
          <Route path=":role/profile" element={<ProfilePage />} />
        </Route>
      </Routes>

      {!isDashboardRoute && <Footer />}
    </>
  );
};

export default App;
