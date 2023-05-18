import {Redirect, useParams} from "react-router-dom";
import PropTypes from "prop-types";

export const LobbyGuard = props => {
    const params = useParams()
    if (localStorage.getItem("token") && localStorage.getItem('lobbyId') === params.id) {
        return props.children;
    }
    return <Redirect to="/overview"/>;
};

LobbyGuard.propTypes = {
    children: PropTypes.node
};