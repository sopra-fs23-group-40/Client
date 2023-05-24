import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Overview.scss";
import HeaderSmall from "./HeaderSmall";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Grid from "@mui/material/Grid";

const Lobby = ({lobby}) => {
    const joinPublicLobby = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username')
            const config = {
                headers: {
                    username, token
                }
            };
            const requestBody = JSON.stringify({id, passcode:""});

            await api.post('/joinLobby', requestBody, config);
            localStorage.setItem('lobbyId', id)
            history.push(`/lobby/` + id);
        } catch (error) {
            alert(`Something went wrong, try again \n${handleError(error)}`);
        }
    };
    const history = useHistory();
    const [cont, setCont] = useState("player container");
    return (
        <div className={cont} onMouseEnter={() => setCont("player selectedContainer")}
             onMouseLeave={() => setCont("player container")}
             onClick={() => lobby.lobbyType === "PUBLIC" ? joinPublicLobby(lobby.lobbyId) : history.push({
                 pathname: '/join/lobby/' + lobby.lobbyId,
                 state: {
                     lobby_name: lobby.name //passing lobby-name along
                 }
             })}
        >

            <div className="player username">{lobby.name}</div>
            <div className="player id">players: {lobby.currentPlayers}/4</div>
            <Grid>
                {lobby.lobbyType === "PUBLIC" ? <LockOpenIcon/> : <LockOutlinedIcon/>}
            </Grid>
        </div>
    )
}

Lobby.propTypes = {
    lobby: PropTypes.object
};

const Overview = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [lobbies, setLobbies] = useState(null);
    const [lobbiesChanged, setLobbiesChanged] = useState(false);

    const logout = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                token
            }
        };
        if (token != null) {
            try {
                await api.post('/logout', null, config);
            } catch (error) {
                console.error("Something went wrong while logging out!");
                console.error("Details:", error);
            }
        }
        localStorage.clear();
        history.push('/login');
    }

    async function createLobby() {
        const username = localStorage.getItem('username')
        const token = localStorage.getItem('token')
        const requestBody = JSON.stringify({username, token})
        try {
            const response = await api.post('/createLobby', requestBody);
            const id = response.data
            localStorage.setItem('lobbyId', id)
            history.push('/lobby/' + id)
        } catch (error) {
            console.error("Something went wrong while creating a lobby!");
            console.error("Details:", error)
        }
    }

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {

            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        token
                    }
                }
                const response = await api.get('/lobbies', config);

                await new Promise(resolve => setTimeout(resolve, 1000));

                setLobbies(response.data);

            } catch (error) {
                console.error("Something went wrong while fetching the lobbies!");
                console.error("Details:", error);
                localStorage.removeItem('token');
                history.push('/login');
            }
        }

        fetchData();
    }, [history]);

    useEffect(() => {
        const interval = setInterval(async () =>{
            try {
                const token = localStorage.getItem('token')
                const config = {
                    headers: {
                        token
                    }
                }
                const response = await api.get('/lobbies', config);
                setLobbies(response.data);
                setLobbiesChanged(true);

            } catch (error) {
                console.error("Something went wrong while fetching the lobbydata!");
                console.error("Details:", error);
            }
        }, 2500)

        return() => clearInterval(interval)

    }, []);

    let content = <Spinner/>;

    // TODO: Do we still need/want the RELOAD button?
    if (lobbies || lobbiesChanged) {
        content = (
            <div className="overview" style={{minWidth: '400px'}}>
                <ul className="overview user-list">
                    {lobbies.map(lobby => (
                        <Lobby lobby={lobby} key={lobby.id}/>
                    ))}
                </ul>
                <div className="button-container">
                    <Button
                        width="60%"
                        onClick={createLobby}
                    >
                        Create New Lobby
                    </Button>
                    <br style={{ height: '10px' }}/>
                    <Button
                        width="60%"
                        onClick={() => window.location.reload()}
                    >
                        Reload
                    </Button>
                </div>
            </div>
        );

    }

    function toggleItems() {
        let menuItems = document.getElementsByClassName("overview menu menuItem toggleable");
        for (let i = 0; i < menuItems.length; i++) {
            if (menuItems[i].style.display === "flex") {
                menuItems[i].style.display = "none";
            } else {
                menuItems[i].style.display = "flex";
            }
        }
    }

    function openProfile() {
        history.push('/profile');
    }

    function openRules() {
        history.push('/rules');
    }

    return (
        <BaseContainer>
            <HeaderSmall height="10"/>
            <BaseContainer className="overview container">
                <div className="overview menu">
                    <div className="overview menu menuItem" onClick={toggleItems}>
                        <svg width="30" height="28">
                            <path d="M4.5 12.5H25.5V15.5H4.5V12.5Z" className="menuBar"/>
                            <path d="M4.5 17.5H25.5V20.5H4.5V17.5Z" className="menuBar"/>
                            <path d="M4.5 22.5H25.5V25.5H4.5V22.5Z" className="menuBar"/>
                        </svg>
                        <p className="menuButtonText">Menu</p>
                    </div>

                    <div className="overview menu menuItem toggleable" onClick={openProfile}>
                        <svg width="28" height="30">
                            <path
                                d="M13.9453 27.8906C21.5742 27.8906 27.8906 21.5605 27.8906 13.9453C27.8906 6.31641 21.5605 0 13.9316 0C6.31641 0 0 6.31641 0 13.9453C0 21.5605 6.33008 27.8906 13.9453 27.8906ZM13.9316 25.8125C10.8008 25.8125 7.62891 24.5273 5.53711 22.2988C7.01367 19.9746 10.2266 18.6074 13.9316 18.6074C17.6094 18.6074 20.8496 19.9473 22.3398 22.2988C20.2344 24.5273 17.0762 25.8125 13.9316 25.8125ZM13.9316 16.2832C11.3066 16.2559 9.24219 14.0684 9.24219 11.1289C9.22852 8.36719 11.3203 6.07031 13.9316 6.07031C16.5566 6.07031 18.6211 8.36719 18.6211 11.1289C18.6211 14.0684 16.5703 16.3105 13.9316 16.2832Z"/>
                        </svg>
                        <p className="menuButtonText">Profile</p>
                    </div>

                    <div className="overview menu menuItem toggleable" onClick={openRules}>
                        <svg width="30" height="30">
                            <path
                                d="M4.19727 29.2988L21.9023 29.2988C22.5039 29.2988 22.9961 28.8203 22.9961 28.2051C22.9961 27.7266 22.668 27.3027 22.2305 27.1523C20.5078 26.4688 20.1523 24.2402 21.8477 22.5312C22.3672 22.0117 22.9961 21.3418 22.9961 19.9746L22.9961 4.29297C22.9961 1.44922 21.5879 0 18.7578 0L4.23828 0C1.4082 0 0 1.43555 0 4.29297L0 25.0742C0 27.8906 1.42188 29.2988 4.19727 29.2988ZM4.32031 27.0977C2.93945 27.0977 2.20117 26.3594 2.20117 25.0605C2.20117 23.8301 3.07617 23.0371 4.44336 23.0371L18.4707 23.0371C18.6484 23.0371 18.8125 23.0234 18.9492 22.9961C18.3066 24.418 18.416 25.9219 19.1406 27.0977ZM3.91016 20.959C3.48633 20.959 3.13086 20.6035 3.13086 20.166L3.13086 2.89844C3.13086 2.46094 3.48633 2.11914 3.91016 2.11914C4.33398 2.11914 4.70312 2.46094 4.70312 2.89844L4.70312 20.166C4.70312 20.6035 4.33398 20.959 3.91016 20.959Z"/>
                        </svg>
                        <p className="menuButtonText">Rules</p>
                    </div>

                    <div className="overview menu menuItem toggleable" onClick={logout}>
                        <svg width="30" height="30">
                            <path
                                d="M3.93555 27.2188L17.418 27.2188C20.0459 27.2188 21.3535 25.8984 21.3535 23.2451L21.3535 17.3545L19.3096 17.3545L19.3096 23.207C19.3096 24.4766 18.6367 25.1748 17.3164 25.1748L4.03711 25.1748C2.7168 25.1748 2.04395 24.4766 2.04395 23.207L2.04395 4.02441C2.04395 2.75488 2.7168 2.04395 4.03711 2.04395L17.3164 2.04395C18.6367 2.04395 19.3096 2.75488 19.3096 4.02441L19.3096 9.86426L21.3535 9.86426L21.3535 3.98633C21.3535 1.3457 20.0459 0 17.418 0L3.93555 0C1.30762 0 0 1.3457 0 3.98633L0 23.2451C0 25.8984 1.30762 27.2188 3.93555 27.2188ZM11.7432 14.6123L24.7812 14.6123L26.6855 14.5361L25.7842 15.3994L23.7402 17.3164C23.5371 17.4941 23.4355 17.7607 23.4355 18.002C23.4355 18.5352 23.8037 18.9287 24.3242 18.9287C24.5908 18.9287 24.7939 18.8271 24.9971 18.6367L29.1357 14.3457C29.3896 14.0918 29.4658 13.8633 29.4658 13.6094C29.4658 13.3428 29.3896 13.127 29.1357 12.873L24.9971 8.58203C24.7939 8.3916 24.5908 8.27734 24.3242 8.27734C23.8037 8.27734 23.4355 8.6582 23.4355 9.19141C23.4355 9.44531 23.5371 9.71191 23.7402 9.88965L25.7842 11.8193L26.6855 12.6826L24.7812 12.5938L11.7432 12.5938C11.21 12.5938 10.7656 13.0635 10.7656 13.6094C10.7656 14.1553 11.21 14.6123 11.7432 14.6123Z"/>
                        </svg>
                        <p className="menuButtonText">Logout</p>
                    </div>

                </div>

                <h1 className="overview title">Overview of all open lobbies:</h1>

                {content}
            </BaseContainer>
        </BaseContainer>
    );
}


export default Overview;