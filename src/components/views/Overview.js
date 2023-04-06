import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Overview.scss";


const Player = ({user}) => {
    const [cont, setCont] = useState("player container");
    return (
        <div className={cont} onMouseEnter={() => setCont("player selectedContainer")}
             onMouseLeave={() => setCont("player container")}
        >

            <div className="player username">{user.username}</div>
            <div className="player id">id: {user.id}</div>
            <div className="player lock"></div>
        </div>
    );
}

Player.propTypes = {
    user: PropTypes.object
};

const Overview = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [users, setUsers] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState("");

    const logout = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                token
            }
        };
        if (token != null) {
            await api.post('/logout', null, config);
        }
        localStorage.removeItem('token');
        history.push('/login');
    }

    const fetchLoggedInUsername = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                token
            }
        };
        const response = await api.get('/loggedInName', config);
        if (response.data != null) {
            setLoggedInUser(response.data);
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
                //localStorage.removeItem('token');
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        token
                    }
                };
                //console.log(token)
                const response = await api.get('/users', config);

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Get the returned users and update the state.
                setUsers(response.data);
                await fetchLoggedInUsername();
                console.log("Test:" + JSON.stringify(response.data))
                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log("Response:" + JSON.stringify(response));
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
                localStorage.removeItem('token');
                //just to make sure that nothing is in the localStorage because else
                //I'm not able to leave the /game/dashboard screen because I'm not
                //authenticated after restarting the server
                history.push('/login');
            }
        }

        fetchData();
    }, [history]);

    let content = <Spinner/>;

    if (users) {
        content = (
            <div className="overview">
                <ul className="overview user-list">
                    {users.map(user => (
                        <Player user={user} key={user.id}/>
                    ))}
                </ul>
                <Button
                    width="100%"
                    onClick={() => logout()}
                >
                    Logout
                </Button>
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
        <BaseContainer className="overview container">

            <div className="overview menu">
                <div className="overview menu menuItem" onClick={toggleItems}>
                    <svg width="30" height="30">
                        <path d="M4.5 12.5H25.5V15.5H4.5V12.5Z" className="menuBar"/>
                        <path d="M4.5 17.5H25.5V20.5H4.5V17.5Z" className="menuBar"/>
                        <path d="M4.5 22.5H25.5V25.5H4.5V22.5Z" className="menuBar"/>
                    </svg>
                    <p className="menuButtonText">Menu</p>
                </div>
                <div className="overview menu menuItem toggleable" onClick={openProfile}>
                    <svg width="28" height="28">
                        <path d="M13.9453 27.8906C21.5742 27.8906 27.8906 21.5605 27.8906 13.9453C27.8906 6.31641 21.5605 0 13.9316 0C6.31641 0 0 6.31641 0 13.9453C0 21.5605 6.33008 27.8906 13.9453 27.8906ZM13.9316 25.8125C10.8008 25.8125 7.62891 24.5273 5.53711 22.2988C7.01367 19.9746 10.2266 18.6074 13.9316 18.6074C17.6094 18.6074 20.8496 19.9473 22.3398 22.2988C20.2344 24.5273 17.0762 25.8125 13.9316 25.8125ZM13.9316 16.2832C11.3066 16.2559 9.24219 14.0684 9.24219 11.1289C9.22852 8.36719 11.3203 6.07031 13.9316 6.07031C16.5566 6.07031 18.6211 8.36719 18.6211 11.1289C18.6211 14.0684 16.5703 16.3105 13.9316 16.2832Z"/>
                    </svg>
                    <p className="menuButtonText">Profile</p>
                </div>
                <div className="overview menu menuItem toggleable" onClick={openRules}>
                    <svg width="28" height="28">
                        <path d="M4.19727 29.2988L21.9023 29.2988C22.5039 29.2988 22.9961 28.8203 22.9961 28.2051C22.9961 27.7266 22.668 27.3027 22.2305 27.1523C20.5078 26.4688 20.1523 24.2402 21.8477 22.5312C22.3672 22.0117 22.9961 21.3418 22.9961 19.9746L22.9961 4.29297C22.9961 1.44922 21.5879 0 18.7578 0L4.23828 0C1.4082 0 0 1.43555 0 4.29297L0 25.0742C0 27.8906 1.42188 29.2988 4.19727 29.2988ZM4.32031 27.0977C2.93945 27.0977 2.20117 26.3594 2.20117 25.0605C2.20117 23.8301 3.07617 23.0371 4.44336 23.0371L18.4707 23.0371C18.6484 23.0371 18.8125 23.0234 18.9492 22.9961C18.3066 24.418 18.416 25.9219 19.1406 27.0977ZM3.91016 20.959C3.48633 20.959 3.13086 20.6035 3.13086 20.166L3.13086 2.89844C3.13086 2.46094 3.48633 2.11914 3.91016 2.11914C4.33398 2.11914 4.70312 2.46094 4.70312 2.89844L4.70312 20.166C4.70312 20.6035 4.33398 20.959 3.91016 20.959Z"/>
                    </svg>
                    <p className="menuButtonText">Rules</p>
                </div>
            </div>

            <h1 className="overview title">Overview</h1>
            <h2><span>Logged in as: </span><span className='overview textColor'>{loggedInUser}</span></h2>
            <p className="overview paragraph">
                Get all users from secure endpoint:
            </p>


            {content}
        </BaseContainer>
    );
}


export default Overview;