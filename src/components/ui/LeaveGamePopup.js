import "styles/ui/PopUp.scss";
import {api} from "../../helpers/api";
import {useHistory} from 'react-router-dom';


const LeaveGamePopup = ({ closePopup }) => {
    const history = useHistory();


    const leaveGame = async () => {
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
        history.push('/overview');
        // TODO: handle localstorage (clear gameId?)
    }
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Are you sure you want to leave the Game?</h2>
        <button style={{margin: "20px", marginRight: "60px"}} onClick={leaveGame}>Confirm</button>
        <button style={{margin: "20px", marginLeft: "60px", backgroundColor: "gray"}} onClick={closePopup}>Cancel</button>
      </div>
    </div>
  );
};

export default LeaveGamePopup;