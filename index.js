import {GameBoard} from "./src/model/gameBoard.js";
import {GameController} from "./src/controller/gameController.js";
import {IO} from "./src/userInteraction/IO.js";

const io = new IO();
const game = new GameBoard();
const gameController = new GameController(io, game)

gameController.start();
