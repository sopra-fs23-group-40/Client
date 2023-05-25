import React from 'react';
import 'styles/views/GameOver.scss';
import BaseContainer from "components/ui/BaseContainer";
import HeaderSmall from "./HeaderSmall";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";

const Player = ({playerName, playerScore}) => {
    return (<div className="player container" style={{width: '100%'}}>
            <img
                src={`https://api.dicebear.com/6.x/bottts/svg?seed=${playerName}`}
                alt="avatar"
                style={{width: "40px", height: "40px"}}
            />
            <div className="player username">{playerName}</div>
            <div className="player score" style={{marginRight: 0, marginLeft: 'auto'}}>{playerScore} Tiles</div>
        </div>
    )
}

const GameOver = () => {

    const history = useHistory();

    const redirect = (url) => {
        for(let item in localStorage) {
            if(!(item === "username" || item === "token")){
                localStorage.removeItem(item)
            }
        }
        history.push(url)
    }

     return (

    <BaseContainer>
          <HeaderSmall height="10"/>
          <div className="gameOver background">
              <h2
                  style={{fontSize: '50px', marginBottom: '0px'}}
              >
                  {localStorage.getItem("winnerName")} wins!
              </h2>

              <center>
                  <img
                      src={`https://api.dicebear.com/6.x/bottts/svg?seed=${localStorage.getItem("winnerName")}`}
                      alt="avatar"
                      style={{width: "30%", height: "30%"}}
                  />
                  <h3
                      style={{fontSize: '30px', margin: '0px'}}
                  >
                      Scores
                  </h3>
                  <ul className="lobby user-list">
                      <Player playerName={localStorage.getItem("player1Name")} playerScore={localStorage.getItem("player1Score")}/>
                      <Player playerName={localStorage.getItem("player2Name")} playerScore={localStorage.getItem("player2Score")}/>
                      <Player playerName={localStorage.getItem("player3Name")} playerScore={localStorage.getItem("player3Score")}/>
                      <Player playerName={localStorage.getItem("player4Name")} playerScore={localStorage.getItem("player4Score")}/>
                  </ul>
              <p>Game duration: {localStorage.getItem("gameDuration")} Minutes</p>
              </center>
              <Button
                  onClick={() => redirect("/overview")}
                  style={{width: '40%'}}
              >
                  Back to the Lobbies
              </Button>
              <br/>
              <Button
                  onClick={() => redirect("/profile")}
                  style={{width: '40%'}}
              >
                  View your Profile
              </Button>

          </div>
      </BaseContainer>
  );
};
export default GameOver;
