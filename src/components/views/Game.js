import "styles/views/Game.scss";
import HeaderSmall from "./HeaderSmall";
import React from "react";
import BaseContainer from "../ui/BaseContainer";
import {Cell} from "../ui/Cell";
import {api} from "../../helpers/api";
import {
    Block1, Block2, Block3, Block4, Block5, Block6, Block7, Block8, Block9, Block10, Block11, Block12, Block13, Block14,
    Block15, Block16, Block17, Block18, Block19, Block20, Block21
        } from "../Game/Block";

const Game = () => {
    const numRows = 20;
    const numCols = 20;

    const numInvRows = 9;
    const numInvCols = 40;

    const invSize = "1.46em";

    let pickedUpBlock = null;

    const removeBlockFromCursor = () => {
        console.log("Removing block from cursor");
        // TODO: Visualize
    }

    const fixBlockToCursor = (block) => {
        console.log("Picking up block " + block.name);
        // TODO: Visualize
    }

    const handleInvClick = (row, col) => {
        const block = invCells[row][col];
        console.log(`Clicked inventory cell (${row},${col})`);

        if(pickedUpBlock === null) {
            if(block === null) return;

            // Picking up new block
            pickedUpBlock = block;
            console.log(pickedUpBlock);
            fixBlockToCursor(block);
        } else {
            if(block === null) {
                pickedUpBlock = null;
                removeBlockFromCursor();
            } else {
                // Swapping Blocks
                if(pickedUpBlock === block) {
                    pickedUpBlock = null;
                    removeBlockFromCursor();
                } else {
                    pickedUpBlock = block;
                    removeBlockFromCursor();
                    fixBlockToCursor(block);
                }
            }
        }
    }

    const handleCellClick = async (row, col) => {
        console.log(`Clicked cell (${row},${col})`);

        if (pickedUpBlock === null) return;

        console.log("Placing block : " + pickedUpBlock.name);


        const gameId = localStorage.getItem('gameId');
        const username = localStorage.getItem('username');
        // TODO: submit player id or change server endpoint to username

        // TODO: Server error "Required request body is missing: public void ch.uzh.ifi.hase.soprafs23.controller.GameController.placeBlock(java.lang.String,java.lang.String,java.lang.String,int,int)
        const requestBody = JSON.stringify({blockName: pickedUpBlock.name, row: row, column: col});

        console.log("BODY:");
        console.log(requestBody);

        const response = await api.put("/games/" + gameId + "/" + username + "/move", requestBody);

        console.log("Response:");
        console.log(response.data);

        pickedUpBlock = null;
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

    const blocks = [new Block1(), new Block2(), new Block3(), new Block4(), new Block5(), new Block6(),
        new Block7(), new Block8(), new Block9(), new Block10(), new Block11(), new Block12(), new Block13(),
        new Block14(), new Block15(), new Block16(), new Block17(), new Block18(), new Block19(), new Block20(),
        new Block21()];

    const invCells = [];
    for(let i = 0; i < numInvRows; i++) {
        invCells.push(new Array(numInvCols).fill(null));
    }

    var colOffset = 0;
    var rowOffset = 0;
    for(let block of blocks) {
        if(colOffset + block.length > numInvCols) {
            colOffset = 0;
            rowOffset += 5;
        }
        for(let row = 0; row < block.height; row++) {
            for(let col = 0; col < block.length; col++) {
                if(block.shape[row][col]) {
                    invCells[row + rowOffset][col + colOffset] = block;
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