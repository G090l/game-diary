import express from 'express';
import { gameController } from '../controllers/gameController';

const router = express.Router();

router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameById);
router.post('/', gameController.createGame);
router.put('/:id', gameController.updateGame);
router.delete('/:id', gameController.deleteGame);

export default router;