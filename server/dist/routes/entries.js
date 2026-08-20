"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const entryController_1 = require("../controllers/entryController");
const router = express_1.default.Router();
router.get('/', entryController_1.entryController.getAllEntries);
router.get('/game/:gameId', entryController_1.entryController.getEntriesByGame);
router.post('/', entryController_1.entryController.createEntry);
router.put('/:id', entryController_1.entryController.updateEntry);
router.delete('/:id', entryController_1.entryController.deleteEntry);
router.get('/stats', entryController_1.entryController.getStats);
exports.default = router;
