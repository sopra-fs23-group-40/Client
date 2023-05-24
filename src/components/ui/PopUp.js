import "styles/ui/PopUp.scss";

const PopUp = ({ closePopup }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Welcome to the Game!</h2>
        <p>
          To <strong>place</strong> a block, click on a block in the inventory of unplayed blocks and then click on an empty cell on the game board.
        </p><p>
          You can <strong>rotate</strong> the block using the left and right arrow keys and <strong>flip</strong> it using the up and down arrow keys.
        </p><p>
          Press Esc or the space bar to cancel the block placement.
        </p>
        <p>
          Except for the very first move of the game each player has <strong>30 sec</strong>. to make a move
        </p>
        <button onClick={closePopup}>Close</button>
      </div>
    </div>
  );
};

export default PopUp;