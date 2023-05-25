import "styles/ui/PopUp.scss";
import {api} from "../../helpers/api";


const ResignPopup = ({ closePopup }) => {

    const resign = async () => {
        const gameId = localStorage.getItem('gameId');
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                username, token
            }
        };
        console.log(token)
        await api.post("/games/" + gameId + "/leaveGame", null, config);
        closePopup()
    }
    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Are you sure you want to 'surrender' and give up your right to make a move for the remainder of the game?</h2>
                <button style={{margin: "20px", marginRight: "60px"}} onClick={resign}>Confirm</button>
                <button style={{margin: "20px", marginLeft: "60px", backgroundColor: "gray"}} onClick={closePopup}>Cancel</button>
            </div>
        </div>
    );
};

export default ResignPopup;