import { Request, Response } from "express";
import { StreamingStrategy } from "@services/StreamingStrategy";

type Stream = Record<string, any>;

/**
 * Recupera i link streaming di un canale TV
 */
export const getTvCahnnel = async (req: Request, res: Response): Promise<Stream[]> => {
    const { type, id } = req.params;
    let streamList: Stream[] = [];
    if (type && id) {
        const protocol = req.protocol;
        const host = req.get("host") || "";
        
        const externalId = id.split(":")[0];
        const providerKey = id.split("-")[1];
        if (providerKey && externalId) {
            const realService = StreamingStrategy.create(providerKey, type, protocol, host);
            if (realService) {
                await realService.initSession();
                streamList = await realService.getMediaLinks(externalId);
            }
        }
        
    }
  return streamList;
};