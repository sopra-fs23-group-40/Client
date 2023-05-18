import "styles/ui/PopUp.scss";

const LeaveGamePopup = ({ closePopup }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Are you sure you want to leave the Game?</h2>
        <button style={{margin: "20px", marginRight: "60px"}} onClick={closePopup}>Confirm</button>
        <button style={{margin: "20px", marginLeft: "60px", backgroundColor: "gray"}} onClick={closePopup}>Cancel</button>
      </div>
    </div>
  );
};

export default LeaveGamePopup;