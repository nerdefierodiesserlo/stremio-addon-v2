import express, { Request, Response } from 'express';
import path from 'path';
import { env } from 'process';
import { BASE_DIR } from '@config/paths';

const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    if (env.USE_CREDENTIALS !== "true") {   
        res.redirect('/');
    } else {
        res.sendFile(path.join(BASE_DIR, 'src/public/html/login.html'));
    }
});

export default router;
