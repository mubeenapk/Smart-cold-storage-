import React from 'react'
import { Route, Routes } from 'react-router'
import MyProfile from '../WarehouseManager/Pages/MyProfile/MyProfile'
import EditProfile from '../WarehouseManager/Pages/EditProfile/EditProfile'
import Changepassword from '../WarehouseManager/Pages/ChangePassword/ChangePassword'
import Staff from '../WarehouseManager/Pages/Staff/Staff'
import Section from '../WarehouseManager/Pages/Section/Section'
import AddStaff from '../WarehouseManager/Pages/AddStaff/AddStaff'
import AddProduct from '../WarehouseManager/Pages/AddProduct/AddProduct'
import ViewStaffSection from '../WarehouseManager/Pages/ViewStaffSection/ViewStaffSection'
import ViewReport from '../WarehouseManager/Pages/ViewReport/ViewReport'
import ViewAlert from '../WarehouseManager/Pages/ViewAlert/ViewAlert'
import Dashboard from '../WarehouseManager/Pages/Dashboard/Dashboard'
import TemperatureMonitor from '../WarehouseManager/Pages/TemperatureMonitor/TemperatureMonitor'


const WareHouseRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path='myprofile' element={<MyProfile/>}/>
        <Route path='changepassword' element={<Changepassword/>}/>
        <Route path='editprofile' element={<EditProfile/>}/>
        <Route path='staff' element={<Staff/>}/>
        <Route path='section' element={<Section/>}/>
        <Route path='addstaff' element={<AddStaff/>}/>
        <Route path='addproduct' element={<AddProduct/>}/>
        <Route path='viewstaffsection' element={<ViewStaffSection/>}/>
        <Route path="viewreport/:id" element={<ViewReport />} />
        <Route path="viewalert" element={<ViewAlert />} />
        <Route path="temperaturemonitor" element={<TemperatureMonitor />} />





      </Routes>
    </div>
  )
}

export default WareHouseRoutes