import React from "react";

//function handleInvClick(cell) {
//    console.log("Clicked inventory block " + cell.name);
//}

export class Block1 {

    constructor() {
    }

    name = "Block1";
    numberOfSquares = 2;
    length = 1;
    height = 2;

    invPosRow = 0;
    invPosCOl = 0;

    shape = [
        [true, false],
        [true, false]
    ];

}

export class Block2 {

    constructor() {
    }

    name = "Block2";
    numberOfSquares = 5;
    length = 3;
    height = 3;

    invPosRow = 0;
    invPosCOl = 0;

    shape = [
        [false, true, false],
        [true, true, true],
        [false, true, false]
    ];

}