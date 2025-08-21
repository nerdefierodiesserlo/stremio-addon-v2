import StreamObject from "@models/StreamObject";

interface BehaviorHints {
    notWebReady?: boolean;
    proxyHeaders?: {
        request: Record<string, string>;
    };
}

interface StreamItem {
    name: string;
    url: string;
    behaviorHints?: BehaviorHints;
}

export default class StremioResponse {
    private streams: StreamItem[] = [];

    constructor(streamList?: StreamObject[]) {
        if (streamList && streamList.length > 0) {
            streamList.forEach(streamObj => {
                this.addStream(streamObj);
            });
        }
    }

    getStreams(): StreamItem[] {
        return this.streams;
    }

    addStream(streamObj?: StreamObject): void {
        if (!streamObj) return;

        const stream: StreamItem = {
            name: streamObj.getTitle(),
            url: streamObj.getStreamUrl()
        };

        if (streamObj.getUseHeaders()) {
            stream.behaviorHints = {
                notWebReady: true,
                proxyHeaders: {
                    request: streamObj.getHeaders()
                }
            };
        }

        this.streams.push(stream);
    }

    toJson(): { streams: StreamItem[] } {
        return { streams: this.streams };
    }
}