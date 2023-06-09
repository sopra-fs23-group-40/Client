import "styles/views/Game.scss";
import HeaderSmallInGame from "./HeaderSmallInGame";
import React, {useEffect, useState} from "react";
import BaseContainer from "../ui/BaseContainer";
import {Cell} from "../ui/Cell";
import {api} from "../../helpers/api";
import PopUp from '../ui/PopUp';
import {BlockType} from "../Game/Block";
import InlineSpinner from "../ui/InlineSpinner";
import useSound from 'use-sound';
import backgroundMusic from '../../assets/backgroundMusic.mp3';
import blockPlacingEffect from '../../assets/blockPlacingEffect.mp3';
import placementNotPossibleEffect from '../../assets/placementNotPossibleEffect.mp3';
import {useHistory} from "react-router-dom";
import Alert from "@mui/material/Alert";

const Game = () => {
    const history = useHistory();
    const [currentPlayer, setCurrentPlayer] = useState(null)
    const [canPlay, setCanPlay] = useState(true);
    const [alert, setAlert] = useState(false)
    const [alertContent, setAlertContent] = useState("");
    const numRows = 20;
    const numCols = 20;
    const [playBackgroundMusic, {pause: pauseBackgroundMusic, stop: stopBackgroundMusic}] = useSound(backgroundMusic, {volume: 0.4, loop: true});
    const [playBlockPlacingEffect] = useSound(blockPlacingEffect, {volume: 0.4, loop: false});
    const [playPlacementNotPossibleEffect] = useSound(placementNotPossibleEffect, {volume: 0.2, loop: false});
    const [showPopup, setShowPopup] = useState(false);
    const player1Color = "#CF141E";
    const player2Color = "#71AD58";
    const player3Color = "#F1DD5D";
    const player4Color = "#35599B";
    const opacity = "80"

    var inventoryColor = "";

    async function getColors() {
        await api.get("/games/" + localStorage.getItem('gameId') + "/players").then((response) => {
            if (response.data[0].playerName === localStorage.getItem('username')) inventoryColor = player1Color;
            if (response.data[1].playerName === localStorage.getItem('username')) inventoryColor = player2Color;
            if (response.data[2].playerName === localStorage.getItem('username')) inventoryColor = player3Color;
            if (response.data[3].playerName === localStorage.getItem('username')) inventoryColor = player4Color;
            console.log("New Color: " + JSON.stringify(inventoryColor))
            localStorage.setItem('inventoryColor', inventoryColor)
        });
    }

    const numInvRows = 10;
    const numInvCols = 40;

    const maxBlockHeight = 5;
    const maxBlockLength = 5;

    const invSize = "1.46em";

    let pickedUpBlock = null;
    let startDate = null;

    function mouseCoordinates(event){
        if(document.getElementById("cursor-cells") == null) return;
        document.getElementById("cursor-cells").style.left = (event.pageX - 10) + "px";
        document.getElementById("cursor-cells").style.top = (event.pageY - 10) + "px";

    }
    window.addEventListener('mousemove', mouseCoordinates);

    function keyDown(event) {
        switch (event.key) {
            case 'Escape':
                removeBlockFromCursor();
                return
            case 'ArrowLeft':
                if(pickedUpBlock != null) rotatePickedUpBlock(270, true);
                return
            case 'ArrowRight':
                if(pickedUpBlock != null) rotatePickedUpBlock(90, true);
                return
            case 'ArrowUp':
                event.preventDefault()
                if(pickedUpBlock != null) flipPickedUpBlock(true);
                return
            case 'ArrowDown':
                event.preventDefault()
                if(pickedUpBlock != null) flipPickedUpBlock(true);
                return
            case 'Space':
                event.preventDefault()
                return
            default:
                return
        }
    }

    window.addEventListener('keydown', keyDown)

    const removeBlockFromCursor = () => {

        document.getElementById("cursor-cells").style.display = "none";

        if (pickedUpBlock != null) {
            if(pickedUpBlockRotation !== 0) rotatePickedUpBlock(360 - pickedUpBlockRotation, false);
            if (pickedUpBlockFlipped) flipPickedUpBlock(false);
        }

        pickedUpBlock = null;
        pickedUpBlockRotation = 0;
        pickedUpBlockFlipped = false;
    }

    function rotateArray(array, degrees) {
        const rows = array.length;
        const cols = array[0].length;
        const rotated = [];

        if (degrees === 90) {
            for(let i = 0; i < cols; i++) {
                rotated.push(new Array(rows).fill(false));
            }
            // Rotate the matrix by 90 degrees
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    rotated[j][rows-1-i] = array[i][j];
                }
            }
        } else if (degrees === 180) {
            for(let i = 0; i < rows; i++) {
                rotated.push(new Array(cols).fill(false));
            }
            // Rotate the matrix by 180 degrees
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    rotated[rows-1-i][cols-1-j] = array[i][j];
                }
            }
        } else if (degrees === 270) {
            for(let i = 0; i < cols; i++) {
                rotated.push(new Array(rows).fill(false));
            }
            // Rotate the matrix by 270 degrees
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    rotated[cols-1-j][i] = array[i][j];
                }
            }
        } else {
            // Invalid degree value
            console.error('Invalid degree value. Please use 90, 180, or 270.');
            return null;
        }

        return rotated;
    }


    let pickedUpBlockRotation = 0;
    const rotatePickedUpBlock = (rot, fixToCursor) => {
        pickedUpBlockRotation = (pickedUpBlockRotation + rot) % 360;
        pickedUpBlock.shape = rotateArray(pickedUpBlock.shape, rot);
        if(fixToCursor) fixBlockToCursor(pickedUpBlock);
    }

    let pickedUpBlockFlipped = false;
    const flipPickedUpBlock = (fix) => {
        pickedUpBlockFlipped = !pickedUpBlockFlipped;
        pickedUpBlock.shape = pickedUpBlock.shape.reverse();
        if(fix) fixBlockToCursor(pickedUpBlock);
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
        for(let i = 0; i < block.shape.length; i++) {
            for (let j = 0; j < block.shape[i].length; j++) {
                if (block.shape[i][j]) {
                    document.getElementById("cursor-cell-" + i + "-" + j).style.opacity = "1";
                    document.getElementById("cursor-cell-" + i + "-" + j).style.backgroundColor = inventoryColor;
                }
            }
        }

    }

    const handleInvClick = (row, col) => {
        const block = invCells[row][col];

        if (pickedUpBlock === null) {
            if (block === null) return;

            // Picking up new block
            pickedUpBlock = block;
            fixBlockToCursor(block);
        } else {
            if (block === null) {
                removeBlockFromCursor();
            } else {
                // Swapping Blocks
                if (pickedUpBlock === block) {
                    removeBlockFromCursor();
                } else {
                    removeBlockFromCursor();
                    pickedUpBlock = block;
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

    async function checkGameOver() {
        const gameId = localStorage.getItem('gameId');
        const response = await api.get("/games/" + gameId + "/isGameOver");

        return response.data.gameOver;
    }

    async function endGame() {
        window.removeEventListener('mousemove', mouseCoordinates);
        window.removeEventListener('keydown', keyDown);

        const gameId = localStorage.getItem('gameId');
        const response = await api.get("/games/" + gameId + "/isGameOver");

        const playerNames = [];
        for (const key in response.data.placedBlocks) {
            if (response.data.placedBlocks.hasOwnProperty(key)) {
                playerNames.push(key);
            }
        }
        const scores = [];
        playerNames.forEach(
            name => scores.push(response.data.placedBlocks[name])
        );

        for(let i = 0; i < scores.length; i++) {
            localStorage.setItem('player' + (i+1) + 'Name', playerNames[i].toString());
            localStorage.setItem('player' + (i+1) + 'Score', scores[i]);
        }

        localStorage.setItem('winnerName', response.data.winnerName);
        localStorage.setItem('gameDuration', response.data.gameDuration);
        // you can add here more information to the local storage that can be displayed in the game over view

        stopBackgroundMusic();

        history.push('/gameOver');
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

                    }

            }
        }

        await api.get("/games/" + localStorage.getItem('gameId') + "/currentPlayer").then((response) => {
            if(getCurrentPlayer() !== null && getCurrentPlayer() !== response.data.playerName) removeBlockFromCursor();
            setCurrentPlayer(response.data.playerName);
        });
    }


    const playerCanPlaceBrick = async () => {
        try {
            const gameId = localStorage.getItem('gameId');
            const username = localStorage.getItem('username');
            const response = await api.get(`/games/${gameId}/${username}/can_place_brick`);
            return response.data;
        } catch (error) {
            console.error("Error checking if player can place brick:", error);
        }
    };

    useEffect(() => {
        // Check if it's the user's first visit
        // If it's the first visit, show the popup and set the flag in localStorage
        if (!localStorage.getItem('firstVisit')) {
          setShowPopup(true);
          localStorage.setItem("firstVisit", "false");
        }
      }, []);

      const closePopup = () => {
        setShowPopup(false);
      };

    const handleCellClick = async (row, col) => {

        if (pickedUpBlock === null) return;

        const gameId = localStorage.getItem('gameId');
        const username = localStorage.getItem('username');

        const requestBody = JSON.stringify({blockName: pickedUpBlock.name, row: row, column: col, shape: pickedUpBlock.shape});

        try {
            removeBlockFromCursor();
            await api.put("/games/" + gameId + "/" + username + "/move", requestBody);
            playBlockPlacingEffect();
            await updateInventory();
            await loadGameboard();
        } catch (e) {
            playPlacementNotPossibleEffect();
            setAlert(true);
            getAlertContent();
            window.scrollTo(0, 0)
            const timeId = setTimeout(() => {
                // After 3 seconds set the show value to false
                setAlert(false)
            }, 3000)
            return () => {
                clearTimeout(timeId)
            }
        }

    };

    function getAlertContent() {
        if(localStorage.getItem('username') !== currentPlayer) {
            setAlertContent("It's not your turn! Please wait.")
        }
        else {
            setAlertContent("Invalid Move!")
        }
    }

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
        }
        else if(currentPlayer == null){
            localStorage.setItem("currentPlayer", null)
            return (
                  <React.Fragment>
                    Game is loading <InlineSpinner />
                  </React.Fragment>
                );
        }
        else {
            return "Please wait... current player: " + currentPlayer;
        }
    }

    var blocks = null;
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
                        if(inventoryColor === "") {
                        }
                        document.getElementById("invcell-" + (row + rowOffset) + "-" + (col + colOffset)).style.backgroundColor = inventoryColor;
                    }
                    else {
                        invCells[row + rowOffset][col + colOffset] = null;
                    }
                }
            }
            colOffset += block.length + 1;
        }
    }

    if(blocks === null){
        async function fetchInventory() {
            if(!localStorage.getItem('inventoryColor')){
                await getColors();
            }
            else {
                inventoryColor = localStorage.getItem('inventoryColor')
            }
            await updateInventory()
        }
        fetchInventory()
    }

    async function hasCurrentPlayerChanged() {
        const responseName = await api.get("/games/" + localStorage.getItem('gameId') + "/currentPlayer").then((response) => {
            return response.data.playerName;
        });
        const local_currentPlayer = localStorage.getItem("currentPlayer")

        if (responseName != null && responseName !== local_currentPlayer) {
            localStorage.setItem("currentPlayer", responseName)
            return true;
        }
        return false;
    }

    useEffect(() => {
            const interval = setInterval(async () => {
                try {
                    if (await hasCurrentPlayerChanged()) {
                        await loadGameboard();
                    }
                    if (await checkGameOver()) {
                        await endGame();
                    }
                    if (! await playerCanPlaceBrick()){
                        const canPlayResponse = await playerCanPlaceBrick();
                        setCanPlay(canPlayResponse);
                    }
                } catch (error) {
                    console.error("Something went wrong while fetching the lobbydata!");
                    console.error("Details:", error);
                }
            }, 2000)
            return () => clearInterval(interval)
    }, );

    function timerUpdate() {
        setTimeout(function () {
            const timerEl = document.getElementById("Timer");
            if(timerEl == null) return
            const nowDate = new Date()
            const runningTime = Math.floor((nowDate - startDate)/1000)
            const newMins = pad(Math.floor(runningTime / 60))
            const newSecs = pad(runningTime % 60)
            timerEl.innerHTML = `${newMins}:${newSecs}`
            timerUpdate()

            function pad(unit) {
                return (("0") + unit).length > 2 ? unit : "0" + unit
            }
        }, 1000)
    }

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

    if (localStorage.getItem('startDate') == null) {
        async function fetchStartDate() {
            const response = await api.get("/games/" + localStorage.getItem('gameId') + "/time")
            localStorage.setItem('startDate', response.data)
            startDate = new Date(response.data)
            timerUpdate()
        }
        fetchStartDate()
    } else {
        if(!startDate){
            startDate = new Date(localStorage.getItem('startDate'))
            timerUpdate()
        }
    }



    pauseBackgroundMusic();
    playBackgroundMusic();

    let timer = <p id="Timer">00:00</p>


    return (

        <BaseContainer>
            <HeaderSmallInGame height="10"/>
            {alert ? <Alert style={{position: 'absolute', left: window.innerWidth/2-150, top: "10px", width: "300px"}} severity='error'>{alertContent}</Alert> : <></> }
            {showPopup && <PopUp closePopup={closePopup} />} {/* Use the PopUp component */}
            <BaseContainer className='game container'  style={{ boxShadow: "none" }}>
                {timer}
                <h1>{getCurrentPlayer()}</h1>
                <div className="cell-field">{cells}</div>
                <br/>
                <div className="canPlaceBrick-container" style={{display: canPlay? "none" : "inline"}}>You cannot place any more pieces!</div>
                <p style={{color: "black", display: canPlay? "inline" : "none"}}>Your block-inventory</p>
                <div className="cell-field" style={{display: canPlay? "inline" : "none", paddingBottom: "20px"}}>{inventoryCells}</div>

                <div className="cell-field" id="cursor-cells" style={{pointerEvents: "none", position: "absolute", display: "none"}}>{cursorCells}</div>

            </BaseContainer>
        </BaseContainer>
    );
};

export default Game;