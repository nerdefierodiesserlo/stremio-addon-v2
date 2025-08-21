type Headers = Record<string, string>;

export default class StreamObject {
    private streamUrl: string;
    private origin: string | null = null;
    private referer: string | null = null;
    private userAgent: string | null = null;
    private title: string = 'Stream';
    private streamService: string | null = null;
    private useHeaders: boolean = false;

    constructor(streamUrl: string, useHeaders?: boolean) {
        this.streamUrl = streamUrl;
        if (useHeaders) this.useHeaders = useHeaders;
    }

    getStreamUrl(): string {
        return this.streamUrl;
    }

    getOrigin(): string | null {
        return this.origin;
    }

    setOrigin(origin: string | null): this {
        this.origin = origin;
        return this;
    }

    getReferer(): string | null {
        return this.referer;
    }

    setReferer(referer: string | null): this {
        this.referer = referer;
        return this;
    }

    getUserAgent(): string | null {
        return this.userAgent;
    }

    setUserAgent(userAgent: string): this {
        this.userAgent = userAgent;
        return this;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(title: string): this {
        this.title = title;
        return this;
    }

    getStreamService(): string | null {
        return this.streamService;
    }

    setStreamService(streamService: string): this {
        this.streamService = streamService;
        return this;
    }

    getUseHeaders(): boolean {
        return this.useHeaders;
    }

    getHeaders(): Headers {
        const headers: Headers = {};
        if (this.userAgent) headers['user-agent'] = this.userAgent;
        if (this.origin) headers['Origin'] = this.origin;
        if (this.referer) headers['Referer'] = this.referer;
        return headers;
    }
}