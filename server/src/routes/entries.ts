import express from 'express';
import { entryController } from '../controllers/entryController';

const router = express.Router();

router.get('/', entryController.getAllEntries);
router.get('/game/:gameId', entryController.getEntriesByGame);
router.post('/', entryController.createEntry);
router.put('/:id', entryController.updateEntry);
router.delete('/:id', entryController.deleteEntry);
router.get('/stats', entryController.getStats);

export default router;