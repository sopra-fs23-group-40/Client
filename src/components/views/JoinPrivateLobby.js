import BaseContainer from "../ui/BaseContainer";
import {Button} from "../ui/Button";
import React, {useState} from "react";
import {api, handleError} from "../../helpers/api";
import {useHistory, useParams} from "react-router-dom";
import PropTypes from "prop-types";
import 'styles/views/Login.scss';
import 'styles/views/JoinLobby.scss';


const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                placeholder="enter passcode here.."
                type={props.type}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func
};

const JoinPrivateLobby = () => {
    const [passcode, setPasscode] = useState("")
    //const [username, setUsername] = useState("")
    //const [lobbyName, setLobbyName] = useState("")
    const params = useParams();
    const history = useHistory();
    const ln = history.location.state.lobby_name

    const joinLobby = async () => {
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username')
            const config = {
                headers: {
                    username, token
                }
            };
            const id = params.id;
            const requestBody = JSON.stringify({id, passcode});

            await api.post('/joinLobby', requestBody, config);
            localStorage.setItem('lobbyId', id)
            history.push(`/lobby/`+id);
        } catch (error) {
            alert(`Something went wrong, try again \n${handleError(error)}`);
            setPasscode("")
        }
    };

    return (
        <BaseContainer>
            <div className="login container">
                <h2>Please enter Passcode to join {ln}</h2>
                <div className="joinlobby form">
                    <FormField
                        type="text"
                        value={passcode}
                        onChange={un => setPasscode(un)}
                    />
                    <div className="login button-container">
                        <Button
                            disabled={!passcode}
                            width="100%"
                            onClick={() => joinLobby()}
                        >
                            Join Lobby
                        </Button>
                    </div>
                    <div className="login labelRegister">
                        <label>

                            <Button
                                width="70%"
                                onClick={() => history.push("/overview")}
                            >
                                Go back to lobbies
                            </Button>
                        </label>
                    </div>
                </div>
            </div>


        </BaseContainer>
);
}
export default JoinPrivateLobby;
