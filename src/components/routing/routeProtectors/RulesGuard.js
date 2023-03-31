import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const RulesGuard = props => {
    if (localStorage.getItem("token")) {
        return props.children;
    }
    return <Redirect to="/login"/>;
};

RulesGuard.propTypes = {
    children: PropTypes.node
};