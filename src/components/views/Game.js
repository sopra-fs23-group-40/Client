import "styles/views/Game.scss";
import HeaderSmall from "./HeaderSmall";
import React, {useEffect, useState} from "react";
import BaseContainer from "../ui/BaseContainer";
import {Cell} from "../ui/Cell";
import {api} from "../../helpers/api";
import {BlockType} from "../Game/Block";
import useSound from 'use-sound';
import backgroundMusic from '../../assets/backgroundMusic.mp3';
import blockPlacingEffect from '../../assets/blockPlacingEffect.mp3';
import placementNotPossibleEffect from '../../assets/placementNotPossibleEffect.mp3';

const Timer = () => {
    const timerEl = document.getElementById("Timer")
    if (timerEl) {
        let newMins = 0
        let newSecs = 0
        setInterval(async function () {
            const runningTime = await api.get("/games/" + localStorage.getItem('gameId') + "/time")
            newMins = (Math.floor(runningTime.data / 60))
            newSecs = (runningTime.data % 60)
            newMins = pad(newMins)
            newSecs = pad(newSecs)
            timerEl.innerHTML = `${newMins}:${newSecs}`

            function pad(unit) {
                return (("0") + unit).length > 2 ? unit : "0" + unit
            }
        }, 1000)
    }
}


const Game = () => {
    const [currentPlayer, setCurrentPlayer] = useState(null)
    const numRows = 20;
    const numCols = 20;
    // TODO: When redirecting to the winner screen, use stop from {stop: stopBackgroundMusic, pause: pauseBackgroundMusic}
    const [playBackgroundMusic, {pause: pauseBackgroundMusic}] = useSound(backgroundMusic, { volume: 0.4, loop: true });
    const [playBlockPlacingEffect] = useSound(blockPlacingEffect, { volume: 0.4, loop: false });
    const [playPlacementNotPossibleEffect] = useSound(placementNotPossibleEffect, { volume: 0.2, loop: false });

    const player1Color = "#CF141E";
    const player2Color = "#71AD58";
    const player3Color = "#F1DD5D";
    const player4Color = "#35599B";
    const opacity = "80"

    var inventoryColor = "";

    // get player list form backend
    api.get("/games/" + localStorage.getItem('gameId') + "/players").then((response) => {
        if (response.data[0].playerName === localStorage.getItem('username')) inventoryColor = player1Color;
        if (response.data[1].playerName === localStorage.getItem('username')) inventoryColor = player2Color;
        if (response.data[2].playerName === localStorage.getItem('username')) inventoryColor = player3Color;
        if (response.data[3].playerName === localStorage.getItem('username')) inventoryColor = player4Color;
    });

    const numInvRows = 9;
    const numInvCols = 40;

    const maxBlockHeight = 4;
    const maxBlockLength = 5;

    const invSize = "1.46em";

    let pickedUpBlock = null;

    function mouseCoordinates(event){
        document.getElementById("cursor-cells").style.left = (event.pageX - 10) + "px";
        document.getElementById("cursor-cells").style.top = (event.pageY - 10) + "px";

    }
    window.addEventListener('mousemove', mouseCoordinates);

    window.addEventListener('keyup', async (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                if(pickedUpBlock != null) {
                    try {
                        const gameId = localStorage.getItem("gameId")
                        const username = localStorage.getItem("username")
                        const requestBody = JSON.stringify({blockName: pickedUpBlock.name, rotationDirection: "CLOCKWISE"});
                        const response = await api.put('/games/' + gameId + '/' + username + '/rotate', requestBody)
                        console.log("Respo: "+ JSON.stringify(response.data))
                        await updateInventory();
                        const new_BlockOnCursor = new BlockType(response.data.shape, response.data.length, response.data.height, response.data.blockName)
                        console.log("New: " +new_BlockOnCursor)
                        fixBlockToCursor(new_BlockOnCursor)

                    } catch (error) {
                        console.error("Something went wrong while fetching the game!");
                        console.error("Details:", error);
                    }
                }
                return
            case 'ArrowRight':
                if(pickedUpBlock != null) {
                    try {
                        const gameId = localStorage.getItem("gameId")
                        const username = localStorage.getItem("username")
                        const requestBody = JSON.stringify({blockName: pickedUpBlock.name, rotationDirection: "COUNTER_CLOCKWISE"});
                        const response = await api.put('/games/' + gameId + '/' + username + '/rotate', requestBody)
                        console.log("Respo: "+ JSON.stringify(response.data))
                        await updateInventory();
                        const new_BlockOnCursor = new BlockType(response.data.shape, response.data.length, response.data.height, response.data.blockName)
                        console.log("New: " +new_BlockOnCursor)
                        fixBlockToCursor(new_BlockOnCursor)

                    } catch (error) {
                        console.error("Something went wrong while fetching the game!");
                        console.error("Details:", error);
                    }
                }
                return
            default:
                return
        }
    })

    const removeBlockFromCursor = () => {

        document.getElementById("cursor-cells").style.display = "none";
    }

    const fixBlockToCursor = (block) => {

        // show cursor cells
        document.getElementById("cursor-cells").style.display = "block";

        // disable all cursor cells
        for(let i = 0; i < maxBlockHeight; i++) {
            for(let j = 0; j < maxBlockLength; j++) {
                document.getElementById("cursor-cell-" + i + "-" + j).style.opacity = "0";
            }
        }

        // enable all cursor cells which are part of the block
        for(let i = 0; i < block.height; i++) {
            for (let j = 0; j < block.length; j++) {
                if (block.shape[i][j]) {
                    document.getElementById("cursor-cell-" + i + "-" + j).style.opacity = "1";
                    document.getElementById("cursor-cell-" + i + "-" + j).style.backgroundColor = inventoryColor;
                }
            }
        }

    }

    const handleInvClick = (row, col) => {
        const block = invCells[row][col];
        console.log(`Clicked inventory cell (${row},${col})`);

        if (pickedUpBlock === null) {
            if (block === null) return;

            // Picking up new block
            pickedUpBlock = block;
            console.log(pickedUpBlock);
            fixBlockToCursor(block);
        } else {
            if (block === null) {
                pickedUpBlock = null;
                removeBlockFromCursor();
            } else {
                // Swapping Blocks
                if (pickedUpBlock === block) {
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

    const cursorCells = [];
    for (let row = 0; row < maxBlockHeight; row++) {
        const rowCells = [];
        for (let col = 0; col < maxBlockLength; col++) {
            rowCells.push(
                <Cell
                    key={`cursor-${row}-${col}`}
                    id={`cursor-cell-${row}-${col}`}
                    style={{width: invSize, height: invSize}}
                    row={row}
                    col={col}
                >
                </Cell>
            );
        }
        cursorCells.push(<div key={row} className="cell-row">{rowCells}</div>);
    }

    const loadGameboard = async () => {
        const gameId = localStorage.getItem('gameId');
        const response = await api.get("/games/" + gameId + "/status");
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
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
                            if (i === 0 && j === 0) {
                                document.getElementById("cell-" + (j) + "-" + (i)).style.backgroundColor = player1Color+opacity;
                            } else if (i === 0 && j === numRows - 1) {
                                document.getElementById("cell-" + (j) + "-" + (i)).style.backgroundColor = player2Color+opacity;
                            } else if (i === numRows - 1 && j === 0) {
                                document.getElementById("cell-" + (j) + "-" + (i)).style.backgroundColor = player3Color+opacity;
                            } else if (i === numRows - 1 && j === numCols - 1) {
                                document.getElementById("cell-" + (j) + "-" + (i)).style.backgroundColor = player4Color+opacity;
                            }
                            // TODO: remove this (?)
                            else {
                                document.getElementById("cell-" + (j) + "-" + (i)).style.backgroundColor = "#eeeeee";
                            }


                    }

            }
        }

        await api.get("/games/" + localStorage.getItem('gameId') + "/currentPlayer").then((response) => {
            setCurrentPlayer(response.data.playerName);
        });
    }

    const handleCellClick = async (row, col) => {
        console.log(`Clicked cell (${row},${col})`);

        if (pickedUpBlock === null) return;

        console.log("Placing block : " + pickedUpBlock.name);


        const gameId = localStorage.getItem('gameId');
        const username = localStorage.getItem('username');

        const requestBody = JSON.stringify({blockName: pickedUpBlock.name, row: row, column: col});

        try {
            const response = await api.put("/games/" + gameId + "/" + username + "/move", requestBody);
            if (response.status !== 200) {
                playPlacementNotPossibleEffect();
            } else {
                playBlockPlacingEffect();
                await removeBlockFromCursor();
                await updateInventory();
                // TODO: When SSE works, remove the next line (loadGameboard()), as it will be done when receiving the event - no matter which player's turn it was
                await loadGameboard();
            }
        } catch (e) {
            playPlacementNotPossibleEffect();
        }

        removeBlockFromCursor();
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


    function getCurrentPlayer() {
        if (currentPlayer === localStorage.getItem('username')) {
            return "It's your turn!";
        } else {
            return "Please wait... current player: " + currentPlayer;
        }
    }

    var blocks = [];
    const updateInventory = async () => {
        const gameId = localStorage.getItem('gameId');
        const username = localStorage.getItem('username');
        const response = await api.get("/games/" + gameId + "/" + username + "/inventory");

        blocks = [];

        for (let block of response.data) {
            blocks.push(new BlockType(block.shape, block.length, block.height, block.blockName));
        }

        for (let i = 0; i < numInvRows; i++) {
            for (let j = 0; j < numInvCols; j++) {
                document.getElementById("invcell-" + i + "-" + j).style.backgroundColor = "#eeeeee";
            }
        }

        var colOffset = 0;
        var rowOffset = 0;
        for (let block of blocks) {
            if (colOffset + block.length > numInvCols) {
                colOffset = 0;
                rowOffset += 5;
            }
            for (let row = 0; row < block.height; row++) {
                for (let col = 0; col < block.length; col++) {
                    if (block.shape[row][col]) {
                        invCells[row + rowOffset][col + colOffset] = block;
                        document.getElementById("invcell-" + (row + rowOffset) + "-" + (col + colOffset)).style.backgroundColor = inventoryColor;
                    }
                }
            }
            colOffset += block.length + 1;
        }

    }

    useEffect(() => {
        const interval = setInterval(async () =>{
            try {
                await loadGameboard()

            } catch (error) {
                console.error("Something went wrong while fetching the lobbydata!");
                console.error("Details:", error);
            }
        }, 2000)

        return() => clearInterval(interval)

    }, );

    const invCells = [];
    for (let i = 0; i < numInvRows; i++) {
        invCells.push(new Array(numInvCols).fill(null));
    }

    const inventoryCells = [];
    for (let row = 0; row < numInvRows; row++) {
        const rowCells = [];
        for (let col = 0; col < numInvCols; col++) {
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

    useEffect(() =>{
        async function fetchInventory(){
            await updateInventory()
        }
        fetchInventory()
    })

    pauseBackgroundMusic();
    playBackgroundMusic();

    let timer = <p id="Timer">00:00</p>
    if(timer){
        Timer()
    }


    return (
        <BaseContainer>
            <HeaderSmall height="10"/>
            <BaseContainer className='game container'>
                {timer}
                <h1 style={{color: "black"}}>{getCurrentPlayer()}</h1>
                <div className="cell-field">{cells}</div>
                <br/>
                <p style={{color: "black"}}>Your block-inventory</p>
                <div className="cell-field">{inventoryCells}</div>

                <p
                    style={{color: "red"}}
                    onClick={() => window.location.reload()}
                    title={"This text is here because synchronization doesn't work over google app engine yet"}
                >
                    <u>Click to Reload page</u>
                </p>

                <div className="cell-field" id="cursor-cells" style={{pointerEvents: "none", position: "absolute", display: "none"}}>{cursorCells}</div>

            </BaseContainer>
        </BaseContainer>
    );
};

export default Game;