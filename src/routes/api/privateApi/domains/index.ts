import express from 'express';
import * as ApiController from '@controllers/api';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const domains = await ApiController.getDomains(req, res);
        res.json(domains);
    } catch (error) {
        let err = error as { message?: string; status?: number };
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
});

router.put('/:code', async (req, res) => {
    try {
        const response = await ApiController.updateDomain(req, res);
        res.json(response);
    } catch (error) {
        let err = error as { message?: string; status?: number };
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
});

export default router;