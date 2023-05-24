import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "../../views/Register";
import {RegisterGuard} from "../routeProtectors/RegisterGuard";
import Profile from "../../views/Profile";
import {ProfileGuard} from "../routeProtectors/ProfileGuard";
import Rules from "../../views/Rules";
import {RulesGuard} from "../routeProtectors/RulesGuard";
import Lobby from "../../views/Lobby";
import {LobbyGuard} from "../routeProtectors/LobbyGuard";
import Game from "../../views/Game";
import Overview from "../../views/Overview";
import {OverviewGuard} from "../routeProtectors/OverviewGuard";
import JoinPrivateLobby from "../../views/JoinPrivateLobby";
import GameOver from "../../views/GameOver";
import {GameOverGuard} from "../routeProtectors/GameOverGuard";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/overview">
                    <OverviewGuard>
                        <Overview/>
                    </OverviewGuard>
                </Route>
                <Route exact path="/login">
                    <LoginGuard>
                        <Login/>
                    </LoginGuard>
                </Route>
                <Route exact path="/register">
                    <RegisterGuard>
                        <Register/>
                    </RegisterGuard>
                </Route>
                <Route exact path="/profile">
                    <ProfileGuard>
                        <Profile/>
                    </ProfileGuard>
                </Route>
                <Route exact path="/rules">
                    <RulesGuard>
                        <Rules/>
                    </RulesGuard>
                </Route>
                <Route exact path="/lobby/:id">
                    <LobbyGuard>
                        <Lobby/>
                    </LobbyGuard>
                </Route>
                <Route exact path="/join/lobby/:id">
                    <OverviewGuard>
                        <JoinPrivateLobby/>
                    </OverviewGuard>
                </Route>
                <Route exact path="/game/:id">
                    <GameGuard>
                        <Game/>
                    </GameGuard>
                </Route>
                <Route exact path="/gameOver">
                    <GameOverGuard>
                        <GameOver/>
                    </GameOverGuard>
                </Route>
                <Route exact path="/">
                    <Redirect to="/overview"/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
