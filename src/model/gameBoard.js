import {Board} from "./board.js";
import DIRECTION from '../utils/direction.js';

export class GameBoard {
    constructor() {
        this.board = new Board(4);
        this.board.placeRandomly(this.generateTile());
        this.board.placeRandomly(this.generateTile());
    }

    generateTile = () => {
        let currentRange = 0;
        let rand = Math.round(Math.random() * 100);
        //TODO continue
        // const tileToRange = {};
        // Object.entries(config.tilesFrequence).map([key, value] => tileToRange[key] = )
        if (rand === 1) return 2;
        return 4;
    }

    // direction = start/end
    #compactSequence = (sequence, direction) => {
        let isChanged = false;
        if (direction === 'start') {
            for (let cellIndex = 0; cellIndex < sequence.length; cellIndex++) {
                let firstNonEmptyCell = cellIndex;
                while (firstNonEmptyCell <= sequence.length - 1) {
                    if (sequence[firstNonEmptyCell] !== 0) {
                        break;
                    }
                    firstNonEmptyCell++;
                }
                if (firstNonEmptyCell !== sequence.length) {
                    isChanged = true;
                    const toMove = sequence.slice(cellIndex, firstNonEmptyCell - cellIndex);
                    for (let i = firstNonEmptyCell; i <= sequence.length - 1; i++) {
                        sequence[i] = 0;
                    }
                    for (let i = 0; i < toMove.length - 1; i++) {
                        sequence[cellIndex + i] = toMove[i];
                    }
                }
            }
        }

        return isChanged;
    }

    // Sum then move
    #groupSequence = (sequence, direction) => {
        let isChanged = false;
        if (sequence[0] === sequence [1]) {
            sequence[0] += sequence[1];
            sequence[1] = 0;
            if (sequence[2] === sequence[3]) {
                sequence[2] += sequence[3];
                sequence[3] = 0;
            }
            isChanged = true;
        } else if (sequence[1] === sequence[2]) {
            sequence[1] += sequence[2];
            sequence[2] = 0;
            isChanged = true;
        } else if (sequence[2] === sequence[3]) {
            sequence[2] += sequence[3];
            sequence[3] = 0;
            isChanged = true;
        }

        const compactDirection = [DIRECTION.RIGHT, DIRECTION.DOWN].includes(direction) ? 'end' : 'start';
        return isChanged || this.#compactSequence(compactDirection) ? sequence : null;
    }

    moveAll = (direction) => {
        let isChanged;
        if ([DIRECTION.RIGHT, DIRECTION.LEFT].includes(direction)) {
            this.board.matrix = this.board.matrix.map(row => {
                const result = this.#groupSequence(row, direction);
                if (result) {
                    isChanged = true
                    return result;
                }
                return row;
            });
        } else {
            //extract columns
            const groupedColumns = this.board.getColumns().map(column => {
                const result = this.#groupSequence(column, direction);
                if (result) {
                    isChanged = true
                    return result;
                }
                return column;
            });
            this.board.updateMatrixColumns(groupedColumns);
        }
        return isChanged;
    }

    getEmptyCells = () => this.board.getEmptyCells();
}