import "styles/views/Lobby.scss";
import {useHistory} from "react-router-dom";
import BaseContainer from "../ui/BaseContainer";
import HeaderSmall from "./HeaderSmall";
import {Button} from "../ui/Button";
import {api} from "../../helpers/api";
import {useState} from "react";




const Lobby = () => {
    const [lobbyType, setLobbyType] = useState(localStorage.getItem('lobbytype'))
    const history = useHistory();

    let tokendisplay = (<div></div>)

    if (lobbyType === "PRIVATE") {
        tokendisplay = (
            <div>
                Lobbytoken: {localStorage.getItem('lobbytoken')}
            </div>
        )
    }

    const change_lobbytype = async () => {
        const token = localStorage.getItem('token')
        const username = localStorage.getItem('username')
        const requestBody = JSON.stringify({username, token})
        const path = window.location.pathname
        const part = path.split('/')
        const id = part[part.length - 1]
        try{
            const response = await api.put('/lobbytype/' + id, requestBody)
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
                {localStorage.getItem('lobbyname')}:
                {tokendisplay}
                <Button
                    width={"50%"}
                    onClick={() => change_lobbytype()}
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