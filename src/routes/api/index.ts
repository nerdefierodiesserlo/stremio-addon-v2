import express from 'express';
import publicApiRouter from '@routes/api/publicApi';
import privateApiRouter from '@routes/api/privateApi';

const router = express.Router();

router.use(publicApiRouter);
router.use(privateApiRouter);

export default router;