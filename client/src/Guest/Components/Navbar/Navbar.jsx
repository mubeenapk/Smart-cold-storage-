import React from 'react'
import { Link } from 'react-router'
import style from './Navbar.module.css'

const Navbar = () => {
  return (
    <div className={style.navbar}>
                  <div className={style.logo}>❄️ ColdStore</div>
          
          <div className={style.nav}>
          <div > <Link to='/Login' className={style.link}>Login</Link> </div> 
          <div > <Link to='/Registration'className={style.link}>Registration</Link> </div>
          
          </div>
      
    </div>
  )
}

export default Navbar