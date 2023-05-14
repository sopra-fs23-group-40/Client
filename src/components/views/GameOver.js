import React from 'react';
import 'styles/views/GameOver.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderSmall from "./HeaderSmall";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";

const GameOver = () => {

    const history = useHistory();

  return (

    <BaseContainer>
          <HeaderSmall height="10"/>
          <div className="gameOver background">
              <h2>Player {localStorage.getItem("winnerName")} wins the game!</h2>

              <h3>Scores</h3>
              <p>Player {localStorage.getItem("player1Name")}: {localStorage.getItem("player1Score")}
                  <br/>Player {localStorage.getItem("player2Name")}: {localStorage.getItem("player2Score")}
                  <br/>Player {localStorage.getItem("player3Name")}: {localStorage.getItem("player3Score")}
                  <br/>Player {localStorage.getItem("player4Name")}: {localStorage.getItem("player4Score")}</p>
              <p>Game duration: {localStorage.getItem("gameDuration")} Minutes</p>

              <Button
                  onClick={() => history.push("/overview")}
              >
                  Back to the Lobbies
              </Button>
              <br/>
              <Button
                  onClick={() => history.push("/profile")}
              >
                  View your Profile
              </Button>

          </div>
      </BaseContainer>
  );
};
export default GameOver;
