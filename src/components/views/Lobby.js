import "styles/views/Lobby.scss";
import {useHistory, useParams} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import HeaderSmall from "./HeaderSmall";
import {Button} from "../ui/Button";
import {api} from "../../helpers/api";
import {useEffect, useState} from "react";
import LobbyModel from "../../models/LobbyModel";




const Lobby = () => {
    const [lobbyName, setLobbyName] = useState(null)
    const [lobbyType, setLobbyType] = useState(null)
    const [playerList, setPlayerList] = useState(null)
    const [isHost, setIsHost] = useState(false)
    const history = useHistory();

    const params = useParams();

    let tokendisplay = (<div></div>)

    if (lobbyType === "PRIVATE") {
        tokendisplay = (
            <div>
                Lobbytoken: {localStorage.getItem('lobbytoken')}
            </div>
        )
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {

            try {
                const token = localStorage.getItem('token')
                const username = localStorage.getItem('username')
                const id = params.id
                const config = {
                    headers: {
                        token, username
                    }
                }
                const response = await api.get('/lobby/' + id, config);
                const lobby = new LobbyModel(response.data);
                setLobbyType(lobby.lobbyType)
                setLobbyName(lobby.name)
                const split = lobby.playerList.split(',')
                setPlayerList(split)

                if (lobby.lobbyToken != null) {
                    localStorage.setItem('lobbyToken', lobby.lobbyToken)
                }
                const isHost = await api.get("/lobby/" + id + "/checkhost", config)
                setIsHost(isHost.data)
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error("Something went wrong while fetching the lobbydata!");
                console.error("Details:", error);
            }
        }

        fetchData();
    }, [history, params]);



    const change_lobbytype = async () => {
        const token = localStorage.getItem('token')
        const username = localStorage.getItem('username')
        const requestBody = JSON.stringify({username, token})
        try{
            const response = await api.put('/lobbytype/' + params.id, requestBody)
            console.log(response)
            setLobbyType(response.data)
        }
        catch (error){
            console.error("Something went wrong while changing the lobbytype!");
            console.error("Details:", error)
        }
    }


    return (
        <BaseContainer>
            <HeaderSmall height="10"/>
            <BaseContainer className="lobby container">
                {lobbyName}

                {tokendisplay}

                <BaseContainer className={"lobby container"}>
                    {playerList}
                </BaseContainer>

                <Button
                    width={"50%"}
                    onClick={() => change_lobbytype()}
                    disabled={!isHost}
                >
                    {lobbyType}
                </Button>

                <Button
                    width={"50%"}
                    onClick={() => history.push("/overview")}
                >
                    leave lobby
                </Button>
            </BaseContainer>
        </BaseContainer>
    );
}


export default Lobby;