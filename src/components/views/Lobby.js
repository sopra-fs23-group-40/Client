import "styles/views/Lobby.scss";
import {useHistory, useParams} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import HeaderSmall from "./HeaderSmall";
import {Button} from "../ui/Button";
import {api, handleError} from "../../helpers/api";
import React, {useEffect, useState} from "react";
import {Spinner} from "../ui/Spinner";
import PropTypes from "prop-types";
import {getDomain} from "../../helpers/getDomain";
import HourglassBottomTwoToneIcon from '@mui/icons-material/HourglassBottomTwoTone';
import Grid from "@mui/material/Grid";
import InfoIcon from "@mui/icons-material/Info";
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import {FormControlLabel, IconButton, Tooltip} from "@mui/material";
import Switch from '@mui/material/Switch';
import useSound from 'use-sound';
import lobbyMusic from '../../assets/lobbyMusic.mp3';

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
    const baseURL = getDomain()
    const params = useParams();
    const id = params.id
    const [tip, setTip] = useState(null)
    const [lobbyName, setLobbyName] = useState(null)
    const [lobbyType, setLobbyType] = useState(null)
    const [playerList, setPlayerList] = useState(null)
    const [isHost, setIsHost] = useState(false)
    const history = useHistory();
    //const username = localStorage.getItem('username')
    //const token = localStorage.getItem('token')

    const [playLobbyMusic, {pause: pauseLobbyMusic, stop: stopLobbyMusic}] = useSound(lobbyMusic, {
        volume: 0.2,
        loop: true
    });

    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const enableMusic = async() => {
        playLobbyMusic();
        setIsMusicPlaying(true);
    }
    const pauseMusic = async() => {
        pauseLobbyMusic();
        setIsMusicPlaying(false);
    }
    const stopMusic = async() => {
        stopLobbyMusic();
        setIsMusicPlaying(false);
    }
    const toggleMusic = async() => {
        if (isMusicPlaying) {
            await pauseMusic();
        } else {
            await enableMusic();
        }
    }

    let tokendisplay
    let startbutton

    if (lobbyType === "PRIVATE") {
        if (isHost) {
            tokendisplay = (
                <div>
                    Passcode: {localStorage.getItem('lobbytoken')}
                </div>

            )
        } else {
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
    if (isHost) {
        startbutton = (
            <Button
                width={"25%"}
                onClick={() => startGame()}
                disabled={!isHost || playerList.length < 4}
                style={{
                    cursor: !isHost || playerList.length < 4 ? "not-allowed" : "pointer",
                    visibility: isHost ? "visible" : "hidden"
                }}
                title={!isHost || playerList.length < 4 ? "You need to be the host and have 4 players in the lobby to be able to start the game." : "Start the game!"}
            >
                Start Game
            </Button>
        )
    } else {
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

    useEffect(() => {

        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const username = localStorage.getItem('username')
                const token = localStorage.getItem('token')
                const config = {
                    headers: {
                        token, username
                    }
                }
                const response = await api.get('/lobby/' + params.id, config);
                setLobbyType(response.data.lobbyType)
                setLobbyName(response.data.name)
                const split = response.data.playerList.split(',')
                setPlayerList(split)

                if (response.data.lobbyToken != null) {
                    localStorage.setItem('lobbytoken', response.data.lobbyToken)
                }

                const isHost = await api.get("/lobby/" + params.id + "/checkhost", config)
                setIsHost(isHost.data)
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error("Something went wrong while fetching the lobbydata!");
                console.error("Details:", error);
            }
        }

        fetchData();
        setRandomTip();

    }, [history, params, baseURL]);

    function initializeGame(gameId) {
        localStorage.setItem("gameId", gameId);
        localStorage.setItem("currentPlayer", null);
    }

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const username = localStorage.getItem('username')
                const token = localStorage.getItem('token')
                const config = {
                    headers: {
                        token, username
                    }
                }
                const response = await api.get('/lobby/' + params.id, config);
                setLobbyType(response.data.lobbyType)
                const split = response.data.playerList.split(',')
                setPlayerList(split)
                if (response.data.status === "INGAME") {
                    console.log(response.data.gameId)
                    if (response.data.gameId) {
                        initializeGame(response.data.gameId)
                        history.push("/game/" + response.data.gameId)
                    }
                }
            } catch (error) {
                console.error("Something went wrong while fetching the lobbydata!");
                console.error("Details:", error);
                history.push("/overview")
            }
        }, 1500)

        return () => clearInterval(interval)

    }, [params.id, history]);

    const change_lobbytype = async () => {
        const username = localStorage.getItem('username')
        const token = localStorage.getItem('token')
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
        const username = localStorage.getItem('username')
        const token = localStorage.getItem('token')
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
        stopMusic();
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
            const username = localStorage.getItem('username')
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    username, token
                }
            };
            const gameId = await api.post('/games', id, config);
            console.log("GameId = " + gameId.data);
            initializeGame(gameId.data)
            localStorage.setItem('gameId', gameId.data);
            stopMusic();
            history.push(`/game/` + gameId.data);
        } catch (error) {
            alert(`Something went wrong, try again \n${handleError(error)}`);
        }
    }

    return (
        <BaseContainer>
            <HeaderSmall height="10"/>
            <BaseContainer className="lobby container">
                <h1><u>{lobbyName}</u></h1>

                {tokendisplay}

                <BaseContainer className={"lobby container"}>
                    {content}
                </BaseContainer>
                <br/>
                <div style={{display: isHost ? "inline" : "none", marginTop: "10px", marginBottom: "10px"}}>
                    <Grid container direction="row" alignItems="center">
                        <Grid item>

                            <FormControlLabel
                                control={
                                    <Switch checked={lobbyType === "PUBLIC"} onChange={() => change_lobbytype()}/>
                                }
                                label={lobbyType}
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip
                                title="Public lobbies can be entered by everyone without a passcode."
                                placement="right"
                            >
                                <IconButton>
                                    <InfoIcon/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </div>
                <Button
                    width={"25%"}
                    onClick={() => leave_lobby()}
                >
                    leave lobby
                </Button>
                <br/>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isMusicPlaying}
                            id={"toggleMusic"}
                            onChange={() => toggleMusic()}
                        />
                    }
                    label={"Lobby Music"}
                />
                <div onClick={setRandomTip} style={{cursor: 'pointer'}}>
                    <Grid container direction="row" alignItems="center">
                        <Grid item>
                            <TipsAndUpdatesIcon/>
                        </Grid>
                        <Grid item marginLeft={"5px"}>
                            Tip: {tip}
                        </Grid>
                    </Grid>
                </div>
                <br/>
                {startbutton}
                <br/>
                <p
                    onClick={() => window.location.reload()}
                    title={"This text is here because synchronization doesn't work over google app engine yet"}
                >
                    <u>Click to Reload page</u>
                </p>
            </BaseContainer>
        </BaseContainer>
    );
}


export default Lobby;