import React from "react";
import PropTypes from "prop-types";
import "styles/views/HeaderSmall.scss";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const HeaderSmall = props => (
  <div className="headersmall container" style={{height: props.height}}>
    {/*<h1 className="header title">SoPra FS23 - Group 40!</h1>
    <ReactLogo width="60px" height="60px"/>*/}
      <img src={require("assets/BigLogo.png")} alt="BigLogo" style={{marginTop: "1px", marginBottom: "10px",width: "184px", height: "50px"}}/>
  </div>
);

HeaderSmall.propTypes = {
  height: PropTypes.string
};

/**
 * Don't forget to export your component!
 */
export default HeaderSmall;
