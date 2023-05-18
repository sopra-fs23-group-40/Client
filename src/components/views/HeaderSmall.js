import React from "react";
import PropTypes from "prop-types";
import "styles/views/HeaderSmall.scss";

const HeaderSmall = props => (
  <div className="headersmall container" style={{height: props.height}}>
      <img src={require("assets/BigLogo.png")} alt="BigLogo" style={{marginTop: "1px", marginBottom: "10px",width: "184px", height: "50px"}}/>
  </div>
);

HeaderSmall.propTypes = {
  height: PropTypes.string
};

export default HeaderSmall;
