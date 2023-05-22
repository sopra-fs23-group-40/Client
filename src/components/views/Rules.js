import "styles/views/Rules.scss";
import {useHistory} from "react-router-dom";
import React from "react";
import BaseContainer from "../ui/BaseContainer";
import {Button} from "../ui/Button";
import HeaderSmall from "./HeaderSmall";

const Rules = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    return (
        <BaseContainer>
            <HeaderSmall height="10"/>
        <BaseContainer className="overview container">
            <h1>Rules</h1>
            <p>
                Try to fit as many of your squares on the board as you can.
                <br />The first piece played by a player must cover a corner square.
                <br />Each new piece must touch at least one other piece of the same color, <b>but only at the corners</b>.
                <br />Pieces of the same color can only touch at the corners.
                <br />There are no restrictions on how pieces of different colors may contact each other.
                <br />Once a piece has been placed on the board, it cannot be moved.
                <br />Whenever a player is unable to place a piece on the board, that player must pass their turn.
                <br />The game ends when both players have passed their turn.
                <br />Once the game ends, the player with the most pieces on the board wins.
            </p>
            <img src={require("assets/RulesGraphic.png")} alt="RulesGraphic" width="50%"/>
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