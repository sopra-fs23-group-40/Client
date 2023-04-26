import "styles/views/Lobby.scss";
import {useHistory, useParams} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import HeaderSmall from "./HeaderSmall";
import {Button} from "../ui/Button";
import {api, handleError} from "../../helpers/api";
import React, {useEffect, useState} from "react";
import LobbyModel from "../../models/LobbyModel";
import {Spinner} from "../ui/Spinner";
import PropTypes from "prop-types";
import HourglassBottomTwoToneIcon from '@mui/icons-material/HourglassBottomTwoTone';
import Grid from "@mui/material/Grid";

const Player = ({player}) => {
    return (<div className="player container">
            <img
                src={`https://api.dicebear.com/6.x/bottts/svg?seed=${player}`}
                alt="avatar"
                style={{width: "40px", height: "40px"}}
            />
            <div className="player username">{player}</div>
        </div>
    )
}

Player.propTypes = {
    player: PropTypes.string
};

const Lobby = () => {
    const [tip, setTip] = useState(null)
    const [evtSource, setEvtSource] = useState(null);
    const [lobbyName, setLobbyName] = useState(null)
    const [lobbyType, setLobbyType] = useState(null)
    const [playerList, setPlayerList] = useState(null)
    const [isHost, setIsHost] = useState(false)
    const history = useHistory();

    const params = useParams();

    let tokendisplay = (<div></div>)
    let startbutton = (<div></div>)

    if (lobbyType === "PRIVATE") {
        if(isHost) {
            tokendisplay = (
                <div>
                    Private Lobby<br/>
                    Token: {localStorage.getItem('lobbytoken')}
                </div>

            )
        }
        else {
            tokendisplay = (
                <div>
                    Private Lobby<br/>
                </div>

            )
        }
    } else {
        tokendisplay = (
            <div>
                Public Lobby<br/>
            </div>
        )
    }

    // returns the START button if Host, else return element which includes Hourglass-Icon and Text "Waiting for Host"
    if(isHost) {
        startbutton = (
            <Button
                width={"25%"}
                onClick={() => startGame()}
                disabled={!isHost || playerList.length < 4}
                style={{cursor: !isHost || playerList.length < 4 ? "not-allowed" : "pointer", visibility: isHost ? "visible" : "hidden"}}
                title={!isHost || playerList.length < 4 ? "You need to be the host and have 4 players in the lobby to be able to start the game." : "Start the game!"}
            >
                Start Game
            </Button>
        )
    }
    else {
        startbutton = (
            <div className={"lobby containerWaitingForHost"}>
                <Grid container direction="row" alignItems="center">
                    <Grid item>
                        <HourglassBottomTwoToneIcon/>
                    </Grid>
                    <Grid item>
                        Waiting for the Host to start the Game!
                    </Grid>
                </Grid>
            </div>

        )
    }

    const setValue = async () => {
        setEvtSource(new EventSource('http://localhost:8080/live-scores'))
    }


    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            await setValue()
            try {
                const token = localStorage.getItem('token')
                const username = localStorage.getItem('username')
                const id = params.id
                const config = {
                    headers: {
                        token, username
                    }
                }
                const response = await api.get('/lobby/' + id, config);
                const lobby = new LobbyModel(response.data);
                setLobbyType(lobby.lobbyType)
                setLobbyName(lobby.name)
                const split = lobby.playerList.split(',')
                setPlayerList(split)


                if (lobby.lobbyToken != null) {
                    localStorage.setItem('lobbytoken', lobby.lobbyToken)
                }

                const isHost = await api.get("/lobby/" + id + "/checkhost", config)
                setIsHost(isHost.data)
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error("Something went wrong while fetching the lobbydata!");
                console.error("Details:", error);
            }
        }

        fetchData();
        setRandomTip();

    }, [history, params]);

    if(evtSource) {
        evtSource.onmessage = async (e) => {
            console.log("Message received: " + e.data)
            try {
                const token = localStorage.getItem('token')
                const username = localStorage.getItem('username')
                const id = params.id
                const config = {
                    headers: {
                        token, username
                    }
                }
                const response = await api.get('/lobby/' + id, config);
                const lobby = new LobbyModel(response.data);
                setLobbyType(lobby.lobbyType)
                setLobbyName(lobby.name)
                const split = lobby.playerList.split(',')
                setPlayerList(split)
            } catch (error) {
                console.error("Something went wrong while fetching the lobbydata!");
                console.error("Details:", error);
            }
        }
    }

    const change_lobbytype = async () => {
        const token = localStorage.getItem('token')
        const username = localStorage.getItem('username')
        const requestBody = JSON.stringify({username, token})
        try {
            const response = await api.put('/lobbytype/' + params.id, requestBody)
            setLobbyType(response.data)
        } catch (error) {
            console.error("Something went wrong while changing the lobbytype!");
            console.error("Details:", error)
        }
    }

    const leave_lobby = async () => {
        const token = localStorage.getItem('token')
        const username = localStorage.getItem('username')
        if (isHost) {
            try {
                const config = {
                    headers: {
                        token, username
                    }
                }
                await api.delete("/deletelobby/" + params.id, config)
            } catch (error) {
                console.error("Something went wrong while deleting the lobby");
                console.error("Details:", error)
            }
        } else {
            try {
                const requestBody = JSON.stringify({username, token})
                await api.put("/leavelobby/" + params.id, requestBody)
            } catch (error) {
                console.error("Something went wrong while leaving the lobby");
                console.error("Details:", error)
            }
        }
        evtSource.close()
        localStorage.removeItem('lobbytoken');
        history.push("/overview")
    }

    let content = <Spinner/>;

    if (playerList) {
        content = (
            <div className="lobby">
                <ul className="lobby user-list">
                    {playerList.map(player => (
                        <Player player={player} key={player}/>
                    ))}
                </ul>
            </div>
        );
    }

    function setRandomTip() {
        const tips = [
            "You can change whether a Lobby is public or private with the button above.",
            "You can start the game by clicking on the button below when the Lobby is full (currently 4 Players).",
            "You can invite your friends by sending them the lobbytoken.",
            "Try to cover up as much space as possible to prevent others from placing their blocks.",
            "Pick your blocks wisely, you can only place them once.",
            "Click this text to get a new tip.",
            "You can leave the Lobby by clicking on the button above.",
            "You can see your statistics when you leave the lobby and open the top right menu.",
            "Log out when you stop playing for security reasons.",
            "In the Lobby list, the lock indicates whether a Lobby is public or private.",
            "Go back to the Lobby overview and open the menu to read the rules of the game.",
            "Only the host of a Lobby (the one who created it) can start the game.",
            "Invite your friends to play with you! But don't tell them your strategies."
        ];
        setTip(tips[Math.floor(Math.random() * tips.length)]);
    }

    async function startGame() {
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username')
            const config = {
                headers: {
                    username, token
                }
            };
            const id = params.id;

            const gameId = await api.post('/games', id, config);
            console.log("GameId = " + gameId.data);
            localStorage.setItem('gameId', gameId.data);
            history.push(`/game/` + gameId.data);
        } catch (error) {
            alert(`Something went wrong, try again \n${handleError(error)}`);
        }
    }

    return (
        <BaseContainer>
            <HeaderSmall height="10"/>
            <BaseContainer className="lobby container">
                {lobbyName}

                {tokendisplay}

                <BaseContainer className={"lobby container"}>
                    {content}
                </BaseContainer>

                <br/>

                <Button
                    width={"25%"}
                    onClick={() => change_lobbytype()}
                    disabled={!isHost}
                    style={{visibility: isHost ? "visible" : "hidden"}}
                >
                    {lobbyType}
                </Button>
                <br/>
                <Button
                    width={"25%"}
                    onClick={() => leave_lobby()}
                >
                    leave lobby
                </Button>

                <p onClick={setRandomTip} style={{cursor: 'pointer'}}>Tip: {tip}</p>
                <br/>
                {startbutton}
                <br/>
                <Button
                    // TODO: remove this before deadline. Redirects to view '/game/lobby.id' and not an actual new game view
                    onClick={() => history.push("/game/" + params.id)}
                >
                    Test-Redirect to Game
                </Button>
            </BaseContainer>
        </BaseContainer>
    );
}


export default Lobby;