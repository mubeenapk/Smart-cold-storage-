import React from 'react'
import WareHouseRoutes from '../../../Routes/WareHouseRoutes'

import Navbar from '../../Components/Navbar/Navbar'
// import Sidebar from '../../Components/Sidebar/Sidebar'

// import styles from './WarehouseHome.module.css'


const WareHouseHome = () => {
  return (
    <div>
    {/* <div><Sidebar/></div>   */}
    <div><Navbar/></div>
    <div><WareHouseRoutes/></div>
    </div>
  )
}

export default WareHouseHome