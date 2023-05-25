import CornerGraphic from "../../assets/RulesGraphics/CornerGraphic.png";
import EdgeGraphic from "../../assets/RulesGraphics/EdgeGraphic.png";
import React from "react";
import Grid from "@mui/material/Grid";


const RulesPopUp = ({ closePopup }) => {
    return (
        <div className="popup">
            <div className="popup-content" style={{maxWidth: "1000px"}}>
                <p>Try to fit as many of your squares on the board as you can.</p>
                <p>The <b>first piece</b> played by a player must cover a corner square of their own color.</p>
                <Grid container direction="row" alignItems="center">
                    <Grid item>
                        <img src={CornerGraphic} alt="CornerGraphic" width="45%"/>
                    </Grid>
                    <Grid item>
                        <img src={EdgeGraphic} alt="EdgeGraphic" width="45%"/>
                    </Grid>
                </Grid>
                <p>Each new piece <b>must</b> touch at least one other piece of the same color, <b>but only at the corners</b>.</p>
                <p>Pieces of the same color can only touch at the corners, they <b>cannot</b> be in contact along an edge. </p>
                <p>
                    To <strong>place</strong> a block, click on a block in the inventory of unplayed blocks and then click on an empty cell on the game board.
                </p><p>
                You can <strong>rotate</strong> the block using the left and right arrow keys and <strong>flip</strong> it using the up and down arrow keys.
            </p><p>
                Press Esc or the space bar to cancel the block placement.
            </p>
                <p>Each player has <strong>30 sec</strong> to make a move
                </p>
                <button onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};

export default RulesPopUp;