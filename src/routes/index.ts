import express, { Request, Response, NextFunction } from "express";
import path from "path";

import streamRouter from "@routes/stream";
import catalogRouter from "@routes/catalog";
import metaRouter from "@routes/meta";
import apiRouter from "@routes/api";
import domainsRouter from "@routes/views/domains";
import loginRouter from "@routes/views/login";

import manifest from "@config/manifest.json";
import { BASE_DIR } from '@config/paths';

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(BASE_DIR, "src/public/html/index.html"));
});

router.get("/manifest.json", (req: Request, res: Response) => {
  res.json(manifest);
});

router.use("/stream", streamRouter);
router.use("/catalog", catalogRouter);
router.use("/meta", metaRouter);
router.use('/api', apiRouter);
router.use('/domains', domainsRouter);
router.use('/login', loginRouter);

export default router;