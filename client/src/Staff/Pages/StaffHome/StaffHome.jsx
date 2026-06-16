import React from 'react'
import StaffRoutes from '../../../Routes/StaffRoutes'
import style from './StaffHome.module.css'
import Navbar from '../../../Staff/Components/Navbar/Navbar'

const StaffHome = () => {
  return (
    <div>

      {/* Navbar should be outside flex container */}
      <Navbar/>

      <div className={style.container}>
        <div className={style.staffrouter}>
          <StaffRoutes/>
        </div>
      </div>

    </div>
  )
}

export default StaffHome