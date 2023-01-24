import {Coordinate} from "./coordinate.js";
import {getRandomNumber} from "../utils/utils.js";

export class Board {
    matrix;

    constructor(size) {
        this.#initMatrix(size);
    }

    #initMatrix = (size) => {
        this.matrix = new Array(size);
        for (let i = 0; i < size; i++) {
            this.matrix[i] = new Array(size);
            for (let j = 0; j < size; j++) {
                this.matrix[i][j] = 0;
            }
        }
    }

    iterateMatrix = (callback) => {
        const matchedCells = [];

        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if (callback(this.matrix[i][j]))
                    matchedCells.push(new Coordinate(i, j));
            }
        }

        return matchedCells;
    }

    getEmptyCells = () => {
        return this.iterateMatrix((value) => value === 0)
    };

    placeRandomly = (value) => {
        const emptyCells = this.getEmptyCells();
        const randomCellIndex = getRandomNumber(0, emptyCells.length - 1);
        const {row, column } = emptyCells[randomCellIndex];
        this.matrix[row][column] = value;
    }

    getColumns = () => {
        const columns = new Array(this.matrix[0].length)
        for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
            columns[columnIndex] = [];
            for (let rowIndex = 0; rowIndex < this.matrix.length; rowIndex++) {
                columns[columnIndex].push(this.matrix[rowIndex][columnIndex])
            }
        }
        return columns
    }

    updateMatrixColumns = (columns) => {
        for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
            for (let rowIndex = 0; rowIndex < this.matrix.length; rowIndex++) {
                this.matrix[rowIndex][columnIndex] = columns[columnIndex][rowIndex]
            }
        }
        return columns
    }
}