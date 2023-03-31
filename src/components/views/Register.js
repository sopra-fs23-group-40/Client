import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {NavLink, useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";

const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                placeholder="enter here.."
                type={props.type}
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};


const Register = () => {
    const history = useHistory();
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const [isShown, setIsShown] = useState(false);

    // This function is called when the checkbox is checked or unchecked
    const togglePassword = () => {
        setIsShown((isShown) => !isShown);
    };

    const doRegister = async () => {
        try {
            const requestBody = JSON.stringify({username, password});
            const response = await api.post('/users', requestBody);
            const user = new User(response.data);
            if(response.headers!= null) {
                const token = response.headers["token"];
                // Store the token into the local storage.
                localStorage.setItem('token', token);
            }
            localStorage.setItem('username', user.username);
            history.push(`/overview`);

        } catch (error) {
            alert(`Something went wrong during registering \n${handleError(error)}`);
            setUsername("")
            setPassword("")
        }
    };

    return (
        <BaseContainer>
            <div className="login container">
                <div className="login form">
                    <FormField
                        label="Username"
                        value={username}
                        type='text'
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="Password"
                        value={password}
                        type={isShown ? "text" : "password"}
                        onChange={n => setPassword(n)}
                    />
                    <div className="login checkbox-container">
                        <label>
                            Show password?
                        </label>
                        <input
                            id="checkbox"
                            type="checkbox"
                            checked={isShown}
                            onChange={togglePassword}
                        />
                    </div>

                    <div className="login button-container">
                        <Button
                            disabled={!username || !password}
                            width="100%"
                            onClick={() => doRegister()}
                        >
                            REGISTER
                        </Button>
                    </div>

                    <div className="login labelRegister">
                        <label>
                            <NavLink className={'text-center mt-4 mb-4'} to="/login">return to Login-Page</NavLink>
                        </label>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};
export default Register;
