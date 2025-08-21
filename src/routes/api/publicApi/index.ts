import { Router } from 'express';
import loginRouter from '@routes/api/publicApi/login';

const router = Router();

router.use('/login', loginRouter);

export default router;