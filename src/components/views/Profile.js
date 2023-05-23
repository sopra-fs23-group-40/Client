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
                const username = localStorage.getItem('username');
                const config = {
                    headers: {
                        username
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
                    <Grid container direction="column" alignItems="center" margin={"10px"} justifyContent="center">
                        <Grid item>
                            <img
                                src={`https://api.dicebear.com/6.x/bottts/svg?seed=${loggedInUser}`}
                                alt="avatar"
                                style={{ width: "150px", height: "150px" }}
                            />
                        </Grid>
                        <Grid item>
                            <h2 style={{ fontSize: '36px', marginTop: '0', marginBottom: '5px' }}>{loggedInUser}'s statistics
                            </h2>
                        </Grid>
                    </Grid>
                    <table id="vertical-1">
                        <tbody>
                        <tr className="profile row-style">
                            <th>Total games Played:</th>
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
                    <Button
                        width="17rem"
                        onClick={() => history.push("/overview")}
                    >
                        Back to Lobby Overview
                    </Button>
                    <br/>
                </div>
            </BaseContainer>
        </BaseContainer>

    );
};


export default Profile;