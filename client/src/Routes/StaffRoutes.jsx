import React from 'react'
import MyProfile from '../Staff/Pages/MyProfile/MyProfile'
import { Route, Routes } from 'react-router'
import StaffDashboard from '../Staff/Pages/StaffDashboard/StaffDashboard'
import EditProfile from '../Staff/Pages/EditProfile/EditProfile'
import ChangePassword from '../Staff/Pages/ChangePassword/ChangePassword'
import ViewProducts from '../Staff/Pages/ViewProducts/ViewProducts'
import Complaint from '../Staff/Pages/Complaint/Complaint'
import AddReport from '../Staff/Pages/AddReport/AddReport'

const StaffRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<StaffDashboard />} />

         <Route path='editprofile' element={<EditProfile/>}/>
        <Route path='myprofile' element={<MyProfile/>}/>
        
        <Route path='changepassword' element={<ChangePassword/>}/>
        <Route path='viewproducts' element={<ViewProducts/>}/>
        <Route path='complaint' element={<Complaint/>}/>
        <Route path="addreport/:id" element={<AddReport />} />


    </Routes>
  )
}

export default StaffRoutes