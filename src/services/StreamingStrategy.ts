import { AbstractStreamingService } from "./AbstractStreamingService";
import { RojadirectaService } from "./RojadirectaService";

const providers: Record<string, any> = {
    'rojadirecta': RojadirectaService,
};

export class StreamingStrategy {
    static create(providerKey: string, mediaType: string, protocol: string, host: string): AbstractStreamingService | null {
        const ServiceClass = providers[providerKey];
        if (!ServiceClass) return null;
        return new ServiceClass(mediaType, protocol, host);
    }
}