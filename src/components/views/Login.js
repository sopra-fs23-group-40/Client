import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import Header from "./Header";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
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

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func
};

const Login = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [isShown, setIsShown] = useState(false);

  // This function is called when the checkbox is checked or unchecked
  const togglePassword = () => {
    setIsShown((isShown) => !isShown);
  };

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      console.log("requestBody:" + JSON.stringify(requestBody));

      const response = await api.post('/login', requestBody);

      console.log("response:" + JSON.stringify(response.status));

      // Get the returned user and update a new object.
      const user = new User(response.data);
      if(response.headers!= null) {
        const token = response.headers["token"];
        // Store the token into the local storage.
        localStorage.setItem('token', token);
        console.log("HEADER TOKEN: "+JSON.stringify(token));
      }
      // Store the username into the local storage.
      localStorage.setItem('username', user.username)

      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/overview`);
    } catch (error) {
      alert(`Something went wrong, try again \n${handleError(error)}`);
      setUsername("")
      setPassword("")
    }
  };
  return (
      <BaseContainer>
        <Header height="100"/>
        <div className="login container">
          <h1 className={"login h1-heading"}>Login</h1>
          <div className="login form">
            <FormField
                label="Username"
                type="text"
                value={username}
                onChange={un => setUsername(un)}
            />
            <FormField
                label="Password"
                type={isShown ? "text" : "password"}
                value={password}
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
                  onClick={() => doLogin()}
              >
                Login
              </Button>
            </div>
            <div className="login labelRegister">
              <label>

                <Button
                    width="70%"
                    onClick={() => history.push("/register")}
                >
                  <u>Register as a new user?</u>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </BaseContainer>
  );
};
export default Login;
