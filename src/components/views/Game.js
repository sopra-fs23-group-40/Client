import "styles/views/Game.scss";
import HeaderSmall from "./HeaderSmall";
import React, {useEffect} from "react";
import BaseContainer from "../ui/BaseContainer";
import {Cell} from "../ui/Cell";
import {api} from "../../helpers/api";
import {useParams} from "react-router-dom";
import {
    Block1, Block2, Block3, Block4, Block5, Block6, Block7, Block8, Block9, Block10, Block11, Block12, Block13, Block14,
    Block15, Block16, Block17, Block18, Block19, Block20, Block21
        } from "../Game/Block";

const Game = () => {
    const params = useParams();
    const id = params.id
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

    const removeBlockFromInventory = (block) => {
        console.log("Removing " + block.name + " from inventory");
        console.log("InvCells:");
        console.log(invCells);
        console.log("inventoryCells:");
        console.log(inventoryCells);

        for(let i = 0; i < numInvCols; i++) {
            for(let j = 0; j < numInvRows; j++) {
                if(invCells[j][i] === block) {
                    console.log("uncoloring cell (" + j + "," + i + ")");
                    invCells[j][i] = null;
                    document.getElementById("invcell-" + (j) + "-" + (i)).style.backgroundColor = "#eeeeee";
                }
            }
        }

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

    function colorCells(block, color, row, column) {
        for(let i = 0; i < block.length; i++) {
            for(let j = 0; j < block.height; j++) {
                if(block.shape[j][i]) {
                    console.log("Coloring cell (" + (row+j) + "/" + (column+i) + ") " + color);
                    document.getElementById("cell-" + (row+j) + "-" + (column+i)).style.backgroundColor = color;
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

        const requestBody = JSON.stringify({blockName: pickedUpBlock.name, row: row, column: col});

        console.log("BODY:");
        console.log(requestBody);

        try {
            const response = await api.put("/games/" + gameId + "/" + username + "/move", requestBody);
            if (response.status !== 200) {
                alert("This move is not possible!");
            } else {
                console.log("Placement of " + pickedUpBlock.name + " at (" + row + "/" + col + ") successful")
                await colorCells(pickedUpBlock, "red", row, col);
                await removeBlockFromCursor();
                await removeBlockFromInventory(pickedUpBlock);
            }
        } catch (e) {
            alert("This move is not possible!");
        }

        pickedUpBlock = null;
    };

    // Create a 2D array to store the Cells
    const cells = [];
    for (let row = 0; row < numRows; row++) {
        const rowCells = [];
        for (let col = 0; col < numCols; col++) {
            rowCells.push(
                <Cell
                    key={`${row}-${col}`}
                    id={`cell-${row}-${col}`}
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
                    id={`invcell-${row}-${col}`}
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

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                // TODO: throws error if you get redirected by clicking on "Test-Redirect to Game" in Lobby (so either ignore error or start valid game with valid gameID)
                const response = await api.get('/games/' + id + "/players");
                console.log(JSON.stringify(response))

                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error("Something went wrong while fetching the lobbydata!");
                console.error("Details:", error);
            }
        }

        fetchData();

    }, []);

    return (
        <BaseContainer>
            <HeaderSmall height="10" />
            <BaseContainer className={'game container'}>
                <div className="cell-field">{cells}</div>
                <br/>
                <div className="cell-field">{inventoryCells}</div>
            </BaseContainer>
        </BaseContainer>
    );
};

export default Game;