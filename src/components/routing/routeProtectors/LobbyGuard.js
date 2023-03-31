import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const LobbyGuard = props => {
    if (localStorage.getItem("token")) {
        return props.children;
    }
    return <Redirect to="/login"/>;
};

LobbyGuard.propTypes = {
    children: PropTypes.node
};