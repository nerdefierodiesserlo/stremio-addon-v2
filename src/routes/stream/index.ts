import express, { Request, Response } from "express";
import * as streamController from "@controllers/stream";
import StremioResponse from "@models/StremioResponse";

const router = express.Router();

router.get("/:type/:id.json", async (req: Request, res: Response) => {
    const { type, id } = req.params as { type: string; id: string };
    let streamList: any[] = [];
    if (type === "tv") {
        streamList = await streamController.getTvCahnnel(req, res);
    }

  const stremioResponse = new StremioResponse(streamList);
  return res.json(stremioResponse.toJson());
});

export = router;