import "styles/views/Game.scss";
import HeaderSmall from "./HeaderSmall";
import React, {useEffect, useState} from "react";
import BaseContainer from "../ui/BaseContainer";
import {Cell} from "../ui/Cell";
import {api} from "../../helpers/api";
import {useParams} from "react-router-dom";
import {
    Block1, Block2, Block3, Block4, Block5, Block6, Block7, Block8, Block9, Block10, Block11, Block12, Block13, Block14,
    Block15, Block16, Block17, Block18, Block19, Block20, Block21
        } from "../Game/Block";
import {getDomain} from "../../helpers/getDomain";

const Game = () => {
    const baseURL = getDomain()
    const [evtSource, setEvtSource] = useState(null)
    const params = useParams();
    const id = params.id
    const numRows = 20;
    const numCols = 20;

    const player1Color = "#CF141E";
    const player2Color = "#71AD58";
    const player3Color = "#F1DD5D";
    const player4Color = "#35599B";

    var inventoryColor = "";

    // get player list form backend
    api.get("/games/" + localStorage.getItem('gameId') + "/players").then((response) => {
        if(response.data[0].playerName === localStorage.getItem('username')) inventoryColor = player1Color;
        if(response.data[1].playerName === localStorage.getItem('username')) inventoryColor = player2Color;
        if(response.data[2].playerName === localStorage.getItem('username')) inventoryColor = player3Color;
        if(response.data[3].playerName === localStorage.getItem('username')) inventoryColor = player4Color;
    });

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

    const loadGameboard = async () => {
        const gameId = localStorage.getItem('gameId');
        const response = await api.get("/games/" + gameId + "/status");
        for(let i = 0; i < numCols; i++) {
            for(let j = 0; j < numRows; j++) {
                switch (response.data[j][i]) {
                    case "PLAYER1":
                        document.getElementById("cell-" + (j) + "-" + (i)).style.backgroundColor = player1Color;
                        break;
                    case "PLAYER2":
                        document.getElementById("cell-" + (j) + "-" + (i)).style.backgroundColor = player2Color;
                        break;
                    case "PLAYER3":
                        document.getElementById("cell-" + (j) + "-" + (i)).style.backgroundColor = player3Color;
                        break;
                    case "PLAYER4":
                        document.getElementById("cell-" + (j) + "-" + (i)).style.backgroundColor = player4Color;
                        break;
                    default:
                        document.getElementById("cell-" + (j) + "-" + (i)).style.backgroundColor = "#eeeeee";
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
                console.log("Placement of " + pickedUpBlock.name + " at (" + row + "/" + col + ") successful");
                await removeBlockFromCursor();
                await updateInventory();
                // TODO: When SSE works, remove the next line (loadGameboard()), as it will be done when receiving the event - no matter which player's turn it was
                await loadGameboard();
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

    loadGameboard();


    var blocks = [];
    const updateInventory = async () => {
        console.log("Updating inventory from backend");
        const gameId = localStorage.getItem('gameId');
        const username = localStorage.getItem('username');
        const response = await api.get("/games/" + gameId + "/" + username + "/inventory");

        blocks = [];

        for (let block of response.data) {
            switch (block.blockName) {
                case "Block1":
                    blocks.push(new Block1());
                    break;
                case "Block2":
                    blocks.push(new Block2());
                    break;
                case "Block3":
                    blocks.push(new Block3());
                    break;
                case "Block4":
                    blocks.push(new Block4());
                    break;
                case "Block5":
                    blocks.push(new Block5());
                    break;
                case "Block6":
                    blocks.push(new Block6());
                    break;
                case "Block7":
                    blocks.push(new Block7());
                    break;
                case "Block8":
                    blocks.push(new Block8());
                    break;
                case "Block9":
                    blocks.push(new Block9());
                    break;
                case "Block10":
                    blocks.push(new Block10());
                    break;
                case "Block11":
                    blocks.push(new Block11());
                    break;
                case "Block12":
                    blocks.push(new Block12());
                    break;
                case "Block13":
                    blocks.push(new Block13());
                    break;
                case "Block14":
                    blocks.push(new Block14());
                    break;
                case "Block15":
                    blocks.push(new Block15());
                    break;
                case "Block16":
                    blocks.push(new Block16());
                    break;
                case "Block17":
                    blocks.push(new Block17());
                    break;
                case "Block18":
                    blocks.push(new Block18());
                    break;
                case "Block19":
                    blocks.push(new Block19());
                    break;
                case "Block20":
                    blocks.push(new Block20());
                    break;
                case "Block21":
                    blocks.push(new Block21());
                    break;
                default:
                    console.log("Block not found: " + block.blockName);
                    break;
            }
        }

        console.log("Blocks from backend:")
        console.log(blocks);

        for(let i = 0; i < numInvRows; i++) {
            for(let j = 0; j < numInvCols; j++) {
                document.getElementById("invcell-" + i + "-" + j).style.backgroundColor = "#eeeeee";
            }
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
                        document.getElementById("invcell-" + (row + rowOffset) + "-" + (col + colOffset)).style.backgroundColor = inventoryColor;
                    }
                }
            }
            colOffset += block.length + 1;
        }

    }

    const invCells = [];
    for(let i = 0; i < numInvRows; i++) {
        invCells.push(new Array(numInvCols).fill(null));
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
                    style={{width: invSize, height: invSize}}
                    onClick={() => handleInvClick(row, col)}
                >
                </Cell>
                , null]
            );
        }
        inventoryCells.push(<div key={row} className="cell-row">{rowCells}</div>);
    }

    updateInventory();

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                setEvtSource(new EventSource(baseURL + 'gameboard-updates'))
                const response = await api.get('/games/' + id + "/players");
                console.log(JSON.stringify(response))

                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                console.error("Something went wrong while fetching the game!");
                console.error("Details:", error);
            }
        }

        fetchData();

    }, [id]);

    if (evtSource){
        evtSource.onerror = (error) => {
            console.log("An error occurred while attempting to connect.");
            console.log(error)
        }

        evtSource.onmessage = async (e) => {
            console.log("Event was received:" + JSON.stringify(e))
            const parse = JSON.parse(e.data)
            if (parse.id.toString() === params.id.toString()) {
                if (parse.message === "MOVE") {
                    try {
                        await loadGameboard()
                    } catch (error) {
                        console.error("Something went wrong while fetching the gameboard!");
                        console.error("Details:", error);
                    }
                }
            }
        }
    }

    return (
        <BaseContainer>
            <HeaderSmall height="10" />
            <BaseContainer className='game container'>
                <div className="cell-field">{cells}</div>
                <br/>
                <div className="cell-field">{inventoryCells}</div>

                <p
                    style={{color: "red"}}
                    onClick={() => window.location.reload()}
                    title={"This text is here because synchronization doesn't work over google app engine yet"}
                >
                    <u>Click to Reload page</u>
                </p>
            </BaseContainer>
        </BaseContainer>
    );
};

export default Game;