// import keyToMove from '../userInteraction/keyToMove';
import {BoardView} from "../view/board.js";

const keyToMove = {}

export class GameController {
    #board;
    #boardView;
    #IO;

    constructor(io, gameBoard) {
        this.#board = gameBoard;
        this.#boardView = new BoardView(io, gameBoard.board);
        this.#IO = io;
    }

    #isLegalInput = (input) =>
        Object.keys(keyToMove).includes(input)

    start = async () => {
        let userInput;

        while (this.#board.getEmptyCells().length /* || board.highestCube === 2048 */) {
            this.#boardView.paint();
            userInput = await this.#IO.getKey('');
            // if (!this.#isLegalInput(userInput)) continue;

            const isChanged = this.#board.moveAll(keyToMove[userInput]);
            if (isChanged) {
                this.#board.generateTile();
            }
        }
    }
}