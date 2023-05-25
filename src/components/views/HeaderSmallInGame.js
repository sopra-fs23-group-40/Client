import React, {useState} from "react";
import PropTypes from "prop-types";
import "styles/views/HeaderSmall.scss";
import {Button} from "../ui/Button";
import LeaveGamePopup from "../ui/LeaveGamePopup";
import logo from 'assets/Logo.png'

const HeaderSmallInGame = props => {
    const [showPopup, setShowPopup] = useState(false)

    const closePopup = () => {
        setShowPopup(false);
    };
    return (
    <div className="headersmall container" style={{height: props.height}}>
        <img src={logo} alt="BigLogo"
             style={{marginTop: "1px", marginBottom: "10px", width: "184px", height: "50px"}}/>
        <Button
            onClick={() => setShowPopup(true)}

        >
            {String.fromCharCode(8592)}Leave Game
        </Button>
        {showPopup && <LeaveGamePopup closePopup={closePopup}/>}
    </div>
    )
};

HeaderSmallInGame.propTypes = {
  height: PropTypes.string
};

export default HeaderSmallInGame;
