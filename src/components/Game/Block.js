export function init(shape, length, height) {
    const matrix = []

    for (let i = 0; i < height; i++ ) {
        matrix[i] = [];
    }
    for(let rows = 0; rows < height; rows++) {
        for(let cols = 0; cols < length; cols++) {
            matrix[rows][cols] = shape[rows][cols] !== 'NEUTRAL';
        }
    }
    return matrix
}

export class BlockType {
    constructor(shape, length, height, name) {
        this.name = name
        this.shape = init(shape, length, height)
        this.length = length
        this.height = height
    }
}
