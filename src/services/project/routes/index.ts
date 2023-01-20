import {Router} from 'express';
import projectController from '../controllers/projectController';

const router = Router();

router.post('/', projectController.create);
router.get('/', projectController.findAll);
router.post('/:name', projectController.runProject);

export default router;
