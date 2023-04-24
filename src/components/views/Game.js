import "styles/views/Game.scss";
import HeaderSmall from "./HeaderSmall";
import React from "react";
import BaseContainer from "../ui/BaseContainer";
import {Cell} from "../ui/Cell";

const Game = () => {
    const numRows = 20;
    const numCols = 20;

    const handleCellClick = (row, col) => {
        console.log(`Clicked cell (${row},${col})`);
        // TODO: check that piece is selected, if piece can be placed place it in back-end
        //  and change the color in front-end
    };

    // Create a 2D array to store the Cells
    const cells = [];
    for (let row = 0; row < numRows; row++) {
        const rowCells = [];
        for (let col = 0; col < numCols; col++) {
            rowCells.push(
                <Cell
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    onClick={() => handleCellClick(row, col)}
                >
                </Cell>
            );
        }
        cells.push(<div key={row} className="cell-row">{rowCells}</div>);
    }

    return (
        <BaseContainer>
            <HeaderSmall height="10" />
            <BaseContainer classname={'game container'}>
                <div className="cell-field">{cells}</div>
            </BaseContainer>
        </BaseContainer>
    );
};

export default Game;