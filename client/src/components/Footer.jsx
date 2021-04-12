import React from "react";
import Styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <div>
      <div className={Styles.footer }>© Trip Planner&nbsp;{new Date().getFullYear()}</div>
    </div>
  );
};

export default Footer;