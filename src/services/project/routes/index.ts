import {Router} from 'express';
import projectController from '../controllers/projectController';

const router = Router();

router.post('/', projectController.create);
router.get('/', projectController.findAll);

export default router;
