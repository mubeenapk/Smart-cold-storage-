import React from "react";
import { Route, Routes } from "react-router-dom";

import GuestHome from "../Guest/Pages/GuestHome/GuestHome";
import AdminHome from "../Admin/Pages/AdminHome/AdminHome";
import WareHouseHome from "../WarehouseManager/Pages/WarehouseHome/WarehouseHome";
import StaffHome from "../Staff/Pages/StaffHome/StaffHome";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="admin/*" element={<AdminHome />} />
      <Route path="/*" element={<GuestHome />} />
      <Route path="warehouse/*" element={<WareHouseHome />} />
      <Route path="staff/*" element={<StaffHome />} />
    </Routes>
  );
};

export default MainRoutes;