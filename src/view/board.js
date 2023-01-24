export class BoardView {
    #board;
    #IO;

    constructor(io, board) {
        this.#board = board;
        this.#IO = io;
    }

    paint = () => {
        this.#board.matrix.forEach((row) => {
            let rowText = "";
            row.forEach((column, columnIndex) => {
                rowText += column;
                if (columnIndex !== row.length - 1) {
                    rowText += ', '
                }
            })
            this.#IO.print(rowText)
        })
    }
}