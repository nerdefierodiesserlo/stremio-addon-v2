import { Request, Response } from "express";
import { DomainService } from "@services/DomainService";
import { StreamingStrategy } from "@services/StreamingStrategy";
import { ChannelLink } from "@models/ChannelLink";

export const getChannelList = async (req: Request, res: Response): Promise<ChannelLink[]> => {
    const { type } = req.params;
    const host = req.get("host") || "";
    const protocol = req.protocol;

    let combinedChannels = [];

    if (type) {
        const domains = await DomainService.getActiveDomains();
        const channelPromises = domains.map(async (domain) => {
            let channelList = [];
            const realService = StreamingStrategy.create(domain.code, type, protocol, host);
            if (realService) {
                await realService.initSession();
                channelList = await realService.getChannelList();
            }
            return channelList;
        });
        const channels = await Promise.all(channelPromises);
        combinedChannels = channels.flat();
    }

    return combinedChannels;
};