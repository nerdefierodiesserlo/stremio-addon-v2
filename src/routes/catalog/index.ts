import express, { Request, Response } from "express";
import * as CatalogController from "@controllers/catalog";

const router = express.Router();

router.get("/:type/tv_channels.json", async (req: Request, res: Response) => {
  const channels = await CatalogController.getChannelList(req, res);
  res.json({ metas: channels });
});

export = router;