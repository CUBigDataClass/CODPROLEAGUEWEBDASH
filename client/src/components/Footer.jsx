import React from "react";
import Styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <div className={Styles.footer}>
      <div>© Trip Planner&nbsp;{new Date().getFullYear()}</div>
    </div>
  );
};

export default Footer;