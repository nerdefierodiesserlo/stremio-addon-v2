import express, { Request, Response } from "express";
import * as MetaController from "@controllers/meta";

const router = express.Router();

router.options("/:type/:id.json", async (req: Request, res: Response) => {
  res.status(200).send();
});

router.get("/:type/:id.json", async (req: Request, res: Response) => {
  const meta = await MetaController.getTvChannelMeta(req, res);
  res.json({ meta });
});

export = router;
