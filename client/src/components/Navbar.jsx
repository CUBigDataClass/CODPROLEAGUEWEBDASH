import React from 'react'
import Logo  from '../images/logo2.png'
import Styles from '../styles/Navbar.module.css'

const MyNavBar = () => {
   return (
      <div className={Styles.navtheme}>
         <img className={Styles.logo} src={Logo} alt="" />
         <h3 className={Styles.text}>Trip Planner</h3>
      </div>
   );
 };
 

export default MyNavBar;
