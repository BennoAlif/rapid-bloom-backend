import {Router} from 'express';
const router = Router();

import projectRoutes from '@/services/project/routes';

router.use('/projects', projectRoutes);

export default router;
