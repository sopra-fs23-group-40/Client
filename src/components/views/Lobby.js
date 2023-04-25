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

const Player = ({player}) => {
    return (<div className="player container">
            <div className="player username">{player}</div>
        </div>
    )
}

Player.propTypes = {
    player: PropTypes.string
};

const Lobby = () => {
    const [lobbyName, setLobbyName] = useState(null)
    const [lobbyType, setLobbyType] = useState(null)
    const [playerList, setPlayerList] = useState(null)
    const [isHost, setIsHost] = useState(false)
    const history = useHistory();

    const params = useParams();

    let tokendisplay = (<div></div>)

    if (lobbyType === "PRIVATE") {
        tokendisplay = (
            <div>
                Private Lobby<br />
                Token: {localStorage.getItem('lobbytoken')}
            </div>
        )
    } else {
        tokendisplay = (
            <div>
                Public Lobby<br />
            </div>
        )
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {

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
    }, [history, params]);


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
            console.log(gameId)
            history.push(`/game/`+gameId.data);
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

                <Button
                    width={"50%"}
                    onClick={() => change_lobbytype()}
                    disabled={!isHost}
                    style={{visibility: isHost ? "visible" : "hidden"}}
                >
                    {lobbyType}
                </Button>

                <Button
                    width={"50%"}
                    onClick={() => leave_lobby()}
                >
                    leave lobby
                </Button>
            </BaseContainer>
            <Button onClick={() => history.push("/game/"+params.id)}>
                Test-Redirect to Game
            </Button>
            <Button onClick={() => startGame()}>
                Start Game
            </Button>
        </BaseContainer>
    );
}


export default Lobby;