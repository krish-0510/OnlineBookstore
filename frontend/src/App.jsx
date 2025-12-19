import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/Common/LandingPage';
import LoginPage from './Pages/Common/LoginPage';
import UserLogin from './Pages/User/UserLogin';
import SellerLogin from './Pages/Seller/SellerLogin';
import AdminLogin from './Pages/Admin/AdminLogin';
import RegisterPage from './Pages/Common/RegisterPage';
import UserRegister from './Pages/User/UserRegister';
import SellerRegister from './Pages/Seller/SellerRegister';
import AdminRegister from './Pages/Admin/AdminRegister';
import UserDashboard from './Pages/User/UserDashboard';
import SellerDashboard from './Pages/Seller/SellerDashboard';
import AdminDashboard from './Pages/Admin/AdminDashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/seller/login" element={<SellerLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/seller/register" element={<SellerRegister />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* Dashboard Routes */}
      <Route path="/user/dashboard" element={<UserDashboard />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
