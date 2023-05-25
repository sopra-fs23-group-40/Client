import "styles/ui/PopUp.scss";
import {api} from "../../helpers/api";
import {useHistory} from 'react-router-dom';


const ResignPopup = ({ closePopup }) => {
    const history = useHistory();


    const resign = async () => {
        //TODO: COMPLETE THIS, THOMAS
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
        localStorage.removeItem('gameId')
        localStorage.removeItem('startDate')
        history.push('/overview');
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