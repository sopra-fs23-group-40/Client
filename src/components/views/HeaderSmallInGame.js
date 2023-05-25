import React, {useState} from "react";
import PropTypes from "prop-types";
import "styles/views/HeaderSmall.scss";
import {Button} from "../ui/Button";
import LeaveGamePopup from "../ui/LeaveGamePopup";
import logo from 'assets/Logo.png'
import PopUp from "../ui/PopUp";
import {IconButton, Tooltip} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ResignPopup from "../ui/ResignPopup";

const HeaderSmallInGame = props => {
    const [showPopupLeaveGame, setShowPopupLeaveGame] = useState(false);
    const [showPopupRules, setShowPopupRules] = useState(false);
    const [showPopupResign, setShowPopupResign] = useState(false)


    const closePopupLeaveGame = () => {
        setShowPopupLeaveGame(false);
    };

    const closePopupRules = () => {
        setShowPopupRules(false);
    };

    const closePopupResign = () => {
        setShowPopupResign(false);
    };

    return (
    <div className="headersmall container" style={{height: props.height}}>
        <img src={logo} alt="BigLogo"
             style={{marginTop: "1px", marginBottom: "10px", width: "184px", height: "50px"}}/>
        <Button onClick={() => setShowPopupRules(true)}>
            Rules
        </Button>
        <div style={{marginRight: "0", marginLeft: "auto"}}>
            <Tooltip
                title="If you feel like you can't make a move anymore, you can resign your right to move by pressing this button and your moves will be skipped for the remainder of the game."
                placement="left"
            >
                <IconButton>
                    <InfoIcon/>
                </IconButton>
            </Tooltip>
            <Button style={{marginRight: "10px"}}
                onClick={() => setShowPopupResign(true)}

            >
                Resign from placing blocks
            </Button>
            <Button
                onClick={() => setShowPopupLeaveGame(true)}

            >
                Leave Game{String.fromCharCode(8618)}
            </Button>
        </div>
        {showPopupResign && <ResignPopup closePopup={closePopupResign}/>}
        {showPopupRules && <PopUp closePopup={closePopupRules}/>}
        {showPopupLeaveGame && <LeaveGamePopup closePopup={closePopupLeaveGame}/>}
    </div>
    )
};

HeaderSmallInGame.propTypes = {
  height: PropTypes.string
};

export default HeaderSmallInGame;
