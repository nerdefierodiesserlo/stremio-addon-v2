import express from 'express';
import apiDomainsRouter from '@routes/api/privateApi/domains';
import * as authMw from '@mw/authMw';

const router = express.Router();

if (process.env.USE_CREDENTIALS === "true") {
    router.use(authMw.isAuthenticatedApi);
}

router.use('/domains', apiDomainsRouter);

export default router;