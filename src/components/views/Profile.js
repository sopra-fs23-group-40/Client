import "styles/views/Profile.scss";
import HeaderSmall from "./HeaderSmall";
import BaseContainer from "../ui/BaseContainer";
import {api, handleError} from "../../helpers/api";
import {useEffect, useState} from "react";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";
import Grid from "@mui/material/Grid";

const Profile = () => {
    const history = useHistory();
    const [loggedInUser, setLoggedInUser] = useState("");
    const [stat, setStat] = useState({gamesPlayed: "", gamesWon: "", minutesPlayed: "", winPercentage: "", blocksPlaced: ""})
    const fetchLoggedInUsername = async () => {
        const token = localStorage.getItem('token');
        const config = {
            headers:{
                token
            }
        };
        const response = await api.get('/loggedInName', config);
        if (response.data != null) {
            setLoggedInUser(response.data);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        token
                    }
                }
                const response = await api.get('/statistics', config);
                setStat(response.data)
                await fetchLoggedInUsername();
                console.log(JSON.stringify(response.data))


            } catch (error) {
                alert(`Something went wrong during fetching the statistics \n${handleError(error)}`);
            }
        }

        fetchData();
    }, []);

    return (
        <BaseContainer>
            <HeaderSmall height="10"/>
            <BaseContainer className="profile tableCont">
                <div className="profile container">
                    <Button
                        width="100%"
                        onClick={() => history.push("/overview")}
                    >
                        {String.fromCharCode(8592)}Go Back to Lobby Overview
                    </Button>
                        <Grid container direction="row" alignItems="center" margin={"10px"} justifyContent="center">
                            <Grid item>
                                <h2>{loggedInUser}'s statistics</h2>
                            </Grid>
                            <Grid item>
                                <img
                                    src={`https://api.dicebear.com/6.x/bottts/svg?seed=${loggedInUser}`}
                                    alt="avatar"
                                    style={{width: "80px", height: "80px"}}
                                />
                            </Grid>
                        </Grid>
                    <table id="vertical-1">
                        <tbody>
                        <tr className="profile row-style">
                            <th style ={{width: '150px'}}>Total games Played:</th>
                            <td>{stat.gamesPlayed}</td>
                        </tr>
                        <tr className="profile row-style">
                            <th>Games won:</th>
                            <td>{stat.gamesWon}</td>
                        </tr>
                        <tr className="profile row-style">
                            <th>Total minutes played:</th>
                            <td>{stat.minutesPlayed}min</td>
                        </tr>
                        <tr className="profile row-style">
                            <th>Win percentage:</th>
                            <td>{stat.winPercentage}%</td>
                        </tr>
                        <tr className="profile row-style">
                            <th>Total blocks placed:</th>
                            <td>{stat.blocksPlaced}</td>
                        </tr>
                        </tbody>
                    </table>
                    <br/>
                </div>
            </BaseContainer>
        </BaseContainer>

    );
};


export default Profile;