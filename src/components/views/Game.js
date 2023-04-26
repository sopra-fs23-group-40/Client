import "styles/views/Game.scss";
import HeaderSmall from "./HeaderSmall";
import React from "react";
import BaseContainer from "../ui/BaseContainer";
import {Cell} from "../ui/Cell";
import {Block1, Block2} from "../Game/Block";

const Game = () => {
    const numRows = 20;
    const numCols = 20;

    const numInvRows = 4;
    const numInvCols = 30;

    const invSize = "1.46em";

    const handleInvClick = (row, col) => {
        const block = invCells[row][col];
        console.log(`Clicked inventory cell (${row},${col}) (${block !== null ? block.name : "empty"})`);
    }

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

    // TODO: Get Blocks from backend

    const blocks = [new Block1(), new Block2()];

    const invCells = [];
    for(let i = 0; i < 4; i++) {
        invCells.push(new Array(20).fill(null));
    }

    var colOffset = 0;
    for(let block of blocks) {
        for(let row = 0; row < block.height; row++) {
            for(let col = 0; col < block.length; col++) {
                if(block.shape[row][col]) {
                    invCells[row][col + colOffset] = block;
                }
            }
        }
        colOffset += block.length + 1;
    }

    const inventoryCells = [];
    for(let row = 0; row < numInvRows; row++) {
        const rowCells = [];
        for(let col = 0; col < numInvCols; col++) {
            rowCells.push([
                <Cell
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    style={invCells[row][col] ? {backgroundColor: "red", width: invSize, height: invSize} : {width: invSize, height: invSize}}
                    onClick={() => handleInvClick(row, col)}
                >
                </Cell>
                , null]
            );
        }
        inventoryCells.push(<div key={row} className="cell-row">{rowCells}</div>);
    }

    return (
        <BaseContainer>
            <HeaderSmall height="10" />
            <BaseContainer classname={'game container'}>
                <div className="cell-field">{cells}</div>
                <br/>
                <div className="cell-field">{inventoryCells}</div>
            </BaseContainer>
        </BaseContainer>
    );
};

export default Game;