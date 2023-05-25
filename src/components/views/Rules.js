import "styles/views/Rules.scss";
import {useHistory} from "react-router-dom";
import React from "react";
import BaseContainer from "../ui/BaseContainer";
import {Button} from "../ui/Button";
import HeaderSmall from "./HeaderSmall";
import RulesGraphic from 'assets/RulesGraphics/RulesGraphic.png'
import CornerGraphic from 'assets/RulesGraphics/CornerGraphic.png'
import EdgeGraphic from 'assets/RulesGraphics/EdgeGraphic.png';


const Rules = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    return (
        <BaseContainer>
            <HeaderSmall height="10"/>
        <BaseContainer className="overview container" style={{textAlign: "center"}}>
            <h1>Rules</h1>
            <p>
                Try to fit as many of your squares on the board as you can.
                <br />The <b>first piece</b> played by a player must cover a corner square. <br/>
                <img src={CornerGraphic} alt="CornerGraphic" width="30%"/>
                <br />Each new piece <b>must</b> touch at least one other piece of the same color, <b>but only at the corners</b>.
                <br />Pieces of the same color can only touch at the corners, they <b>cannot</b> be in contact along an edge. <br />
                <img src={EdgeGraphic} alt="CornerGraphic" width="30%"/>
                <br />There are no restrictions on how pieces of different colors may contact each other.
                <br />Once a piece has been placed on the board, it cannot be moved.
                <br />Whenever a player is unable to place a piece on the board, that player must pass their turn.
                <br />The game ends once no player can turn anymore.
                <br />Once the game ends, the player with the most # of tiles (not blocks!) placed on the board wins.
            </p>
            <img src={RulesGraphic} alt="RulesGraphic" width="50%"/>
            <br />
            <Button
                width="20em"
                onClick={() => history.push("/overview")}
            >
                Back to overview
            </Button>
        </BaseContainer>
        </BaseContainer>
    );
}

export default Rules;