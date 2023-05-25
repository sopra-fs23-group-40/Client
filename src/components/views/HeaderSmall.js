import React from "react";
import PropTypes from "prop-types";
import "styles/views/HeaderSmall.scss";
import logo from 'assets/Logo.png'

const HeaderSmall = props => (
  <div className="headersmall container" style={{height: props.height}}>
      <img src={logo} alt="BigLogo" style={{marginTop: "1px", marginBottom: "10px",width: "184px", height: "50px"}}/>
  </div>
);

HeaderSmall.propTypes = {
  height: PropTypes.string
};

export default HeaderSmall;
