import {Cell} from "../ui/Cell";
import React from "react";

function handleInvClick(cell) {
    console.log("Clicked inventory block " + cell.name);
}

class Block1 {
    name = "Block1";
    numberOfSquares = 1;
    length = 1;
    height = 1;

    shape = [
        [
            <Cell
                key={`${row}-${col}`}
                row={row}
                col={col}
                onClick={() => handleInvClick(this)}
            >
            </Cell>],
    ];

}