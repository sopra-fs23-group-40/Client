import "styles/views/Profile.scss";
import HeaderSmall from "./HeaderSmall";
import BaseContainer from "../ui/BaseContainer";
import {api, handleError} from "../../helpers/api";
import {useEffect, useState} from "react";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";

const Profile = () => {
    const history = useHistory();
    const [stat, setStat] = useState({gamesPlayed: "", gamesWon: "", minutesPlayed: ""})

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
                console.log(JSON.stringify(response.data.gamesPlayed))
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
                    <table id="vertical-1">
                        <caption> <h2>User statistics</h2></caption>
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
                            <td>{stat.minutesPlayed}</td>
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