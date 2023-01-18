import {Router} from 'express';
import projectController from '../controllers/projectController';

const router = Router();

router.post('/', projectController.create);
router.get('/', projectController.findAll);
router.post('/queue', projectController.queue);
router.get('/queue', projectController.getAllQueue);

export default router;
