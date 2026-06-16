import React from "react";
import { Route, Routes } from "react-router-dom";

import Subcategory from "../Admin/Pages/Subcategory/Subcategory";
import District from "../Admin/Pages/District/District";
import Type from "../Admin/Pages/Type/Type";
import Category from "../Admin/Pages/Category/Category";
import AdminRegistration from "../Admin/Pages/AdminRegistration/AdminRegistration";
import ViewComplaint from "../Admin/Pages/ViewComplaint/ViewComplaint";
import Reply from "../Admin/Pages/Reply/Reply";
import ProductTemplate from "../Admin/Pages/ProductTemplate/ProductTemplate";
import AdminDashboard from "../Admin/Pages/AdminDashboard/AdminDashboard";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/district" element={<District />} />
      <Route path="/type" element={<Type />} />
      <Route path="/category" element={<Category />} />
      <Route path="/subcategory" element={<Subcategory />} />
      <Route path="/producttemplate" element={<ProductTemplate />} />
      <Route path="/adminregistration" element={<AdminRegistration />} />
      <Route path="/viewcomplaint" element={<ViewComplaint />} />
      <Route path="/reply/:id" element={<Reply />} />
    </Routes>
  );
};

export default AdminRoutes;