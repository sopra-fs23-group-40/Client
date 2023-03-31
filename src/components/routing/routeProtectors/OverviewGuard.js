import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const OverviewGuard = props => {
    if (localStorage.getItem("token")) {
        return props.children;
    }
    return <Redirect to="/login"/>;
};

OverviewGuard.propTypes = {
    children: PropTypes.node
};