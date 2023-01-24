import {Board} from "./board.js";
import DIRECTION from '../utils/direction.js';

export class GameBoard {
    #highestTile;

    constructor() {
        this.#highestTile = 2;
        this.board = new Board(4);
        this.board.placeRandomly(this.generateTile());
        this.board.placeRandomly(this.generateTile());
    }

    get highestTile() {
        return this.#highestTile;
    }

    generateTile = () => {
        let currentRange = 0;
        let rand = Math.round(Math.random() * 100);
        //TODO continue
        // const tileToRange = {};
        // Object.entries(config.js.tilesFrequence).map([key, value] => tileToRange[key] = )
        if (rand === 1) return 2;
        return 4;
    }

    // Returns index of first non-zero cell
    #findFirstNonZeroStartingFromIndex = (sequence, startIndex, compactDirection) => {
        let toIndex, condition;
        if (compactDirection === 'start') {
            toIndex = sequence.length;
            condition = (i, to) => i < to;
        } else {
            toIndex = -1;
            condition = (i, to) => i > to;
        }
        for (let cellIndex = startIndex; condition(cellIndex, toIndex); compactDirection === 'start' ? cellIndex++ : cellIndex--) {
            let firstNonEmptyCell = cellIndex;
            while (condition(firstNonEmptyCell, toIndex)) {
                if (sequence[firstNonEmptyCell] !== 0) {
                    break;
                }
                compactDirection === 'start' ? firstNonEmptyCell++ : firstNonEmptyCell--;
            }
            if (firstNonEmptyCell !== toIndex)
                return firstNonEmptyCell;
        }
        return -1;
    }

    // direction = start/end
    #compactSequence = (sequence, direction) => {
        let nonZeroNumbers = [];
        let nonZeroIndexes = [];
        sequence.forEach((number, index) => {
            if (number) {
                nonZeroNumbers.push(number);
                nonZeroIndexes.push(index);
            }
        })

        nonZeroIndexes.forEach((index) => sequence[index] = 0);

        if (direction === 'start' && nonZeroNumbers.length) {
            nonZeroNumbers.forEach((number, index) => {
                if (sequence[index] !== number) {
                    sequence[index] = number
                }
            });
        }
        if (direction === 'end' && nonZeroNumbers.length) {
            nonZeroNumbers.reverse().forEach((number, index) => {
                if (sequence[sequence.length - (1 + index)] !== number) {
                    sequence[sequence.length - (1 + index)] = number;
                }
            });
        }

        // If the last index of the non zero number is in row from the sequence edge - return true for indicate change.
        if (direction === 'start') {
            return nonZeroIndexes.length && nonZeroIndexes[nonZeroIndexes.length - 1] !== nonZeroIndexes.length - 1
        }

        return nonZeroIndexes.length && nonZeroIndexes.reverse()[nonZeroIndexes.length - 1] !== sequence.length - nonZeroIndexes.length
    }

    // Sum then move
    #groupSequence = (sequence, direction) => {
        let isChanged = false;
        const compactDirection = [DIRECTION.RIGHT, DIRECTION.DOWN].includes(direction) ? 'end' : 'start';

        let startIndex, toIndex, condition;
        if (compactDirection === 'start') {
            startIndex = 0;
            toIndex = sequence.length - 1;
            condition = (i, to) => i < to;
        } else {
            startIndex = sequence.length - 1;
            toIndex = 0;
            condition = (i, to) => i > to;
        }

        for (let i = startIndex; condition(i, toIndex); compactDirection === 'start' ? i++ : i--) {
            let firstNonEmptyIndex, secondNonEmptyIndex;
            firstNonEmptyIndex = this.#findFirstNonZeroStartingFromIndex(sequence, i, compactDirection);
            if (compactDirection === 'start' && (firstNonEmptyIndex > -1 && firstNonEmptyIndex !== sequence.length - 1)
            || (compactDirection === 'end' && (firstNonEmptyIndex < sequence.length && firstNonEmptyIndex !== 0))) {
                secondNonEmptyIndex = this.#findFirstNonZeroStartingFromIndex(sequence, compactDirection === 'start' ? firstNonEmptyIndex + 1 : firstNonEmptyIndex - 1, compactDirection);

                if (secondNonEmptyIndex !== -1) {
                    if (sequence[firstNonEmptyIndex] === sequence[secondNonEmptyIndex]) {
                        isChanged = true;
                        sequence[firstNonEmptyIndex] += sequence[secondNonEmptyIndex];
                        sequence[secondNonEmptyIndex] = 0;

                        if (sequence[firstNonEmptyIndex] > this.#highestTile) {
                            this.#highestTile = sequence[firstNonEmptyIndex];
                        }
                        i = secondNonEmptyIndex
                    }
                } else {
                    break;
                }
            }
        }

        const isCompactChange = this.#compactSequence(sequence, compactDirection);
        return (isChanged || isCompactChange) ? sequence : null;
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