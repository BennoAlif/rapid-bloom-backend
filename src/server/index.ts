import 'module-alias/register';

import express, {Application, Router, json, urlencoded} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import morganMiddleware from '@/middlewares/morgan';
import v1Routes from '@/routes/v1';

const router = Router();
router.use('/api/v1', v1Routes);

dotenv.config();

const app: Application = express();

app.use(json());
app.use(urlencoded({extended: true}));
app.use(helmet());
app.use(cors());
app.use(morganMiddleware);

app.use(router);

app.get('/ping', (req, res) => {
  return res.status(200).json({message: 'PONG!'});
});

export default app;
