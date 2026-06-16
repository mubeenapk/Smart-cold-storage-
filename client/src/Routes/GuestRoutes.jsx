import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "../Guest/Pages/Login/Login";
import Registration from "../Guest/Pages/WareHouseRegistration/WareHouseRegistration";
import Index from "../Guest/Pages/Index/Index";
import AdminDashboard from "../Admin/Pages/AdminDashboard/AdminDashboard";

const GuestRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default GuestRoutes;