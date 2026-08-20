"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const router = express_1.default.Router();
router.get('/', gameController_1.gameController.getAllGames);
router.get('/:id', gameController_1.gameController.getGameById);
router.post('/', gameController_1.gameController.createGame);
router.put('/:id', gameController_1.gameController.updateGame);
router.delete('/:id', gameController_1.gameController.deleteGame);
exports.default = router;
