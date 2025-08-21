import UserSession from '@models/UserSession';
import axios, { AxiosInstance } from 'axios';
import cheerio from 'cheerio';
import m3u8Parser from 'm3u8-parser';
import LogService from './LogService';
import xml2js from 'xml2js';
import { DomainService } from './DomainService';
import StreamObject from '@models/StreamObject';
import { Meta } from '@models/Meta';
import { M3U8Object } from '@models/M3U8Object';

const parser = new xml2js.Parser();

export abstract class AbstractStreamingService {
    externalId: string | null = null;
    seasonNumber: string | null = null;
    episodeNumber: string | null = null;
    cheerio = cheerio;
    m3u8Parser = m3u8Parser;
    logService = LogService;
    client: AxiosInstance;
    userSession: UserSession;
    mediaType: string;
    serviceCode: string;
    protocol: string;
    host: string;
    baseURL!: string;
    unsafelyOrigins: string[] = [];

    constructor(serviceCode: string, mediaType: string, protocol: string, host: string) {
        if (new.target === AbstractStreamingService) {
            throw new Error("AbstractStreamingService cannot be instantiated directly.");
        }
        if (!mediaType) throw new Error('Il tipo di media non può essere nullo');
        if (!serviceCode) throw new Error('serviceCode non può essere nullo');

        this.serviceCode = serviceCode;
        this.client = axios.create({});
        this.userSession = new UserSession();
        this.mediaType = mediaType;
        this.protocol = protocol;
        this.host = host;
    }

    abstract getMediaLinks(id: string): Promise<StreamObject[]>;
    abstract getChannelList(): Promise<any[]>;
    abstract getTvChannelMeta(id: string): Promise<Meta>;

    setExternalId(externalId: string) {
        this.externalId = externalId;
        return this;
    }

    setSeasonNumber(seasonNumber: string) {
        this.seasonNumber = seasonNumber;
        return this;
    }

    setEpisodeNumber(episodeNumber: string) {
        this.episodeNumber = episodeNumber;
        return this;
    }

    setUnsafelyOrigins(unsafelyOrigins: string[]) {
        this.unsafelyOrigins = unsafelyOrigins;
    }

    async initSession(): Promise<void> {
        const domain = await DomainService.getDomain(this.serviceCode);
        if (!domain) {
            throw new Error(`Dominio non trovato per il codice: ${this.serviceCode}`);
        }
        this.baseURL = domain.baseURL;
        await this.userSession.createSession(this.baseURL, this.unsafelyOrigins);
    }

    async sniffM3u8(url: string): Promise<M3U8Object | null> {
        const browser = await this.userSession.launchBrowser(this.unsafelyOrigins);
        const page = await browser.newPage();

        if (this.userSession.userAgent) {
            await page.setUserAgent(this.userSession.userAgent);
        }

        let guard = false;
        let timeoutId: NodeJS.Timeout;

        const p1: Promise<M3U8Object | null> = new Promise((resolve, reject) => {
            const handleResponse = async (response: import('puppeteer').HTTPResponse) => {
                try {
                    const req = response.request();
                    const responseUrl = response.url();
                    if (!guard && responseUrl.includes('.m3u8')) {
                        guard = true;
                        resolve({
                            content: await response.text(),
                            url: responseUrl,
                            referer: req.headers()['referer'] || null,
                            origin: req.headers()['origin'] || null,
                        });
                    }
                } catch (error) {
                    clearTimeout(timeoutId);
                    page.off("response", handleResponse);
                    reject(error);
                }
            };

            page.on("response", handleResponse);

            timeoutId = setTimeout(() => {
                page.off("response", handleResponse);
                resolve(null);
            }, 10000);
        });

        try {
            await page.goto(url, { waitUntil: "domcontentloaded" });
        } catch (err) {
            this.logService.log("Errore in page.goto(): " + err, "error");
            await browser.close();
            return null;
        }

        try {
            const m3u8Output = await p1;
            this.logService.log("chiudo browser", "debug");
            await browser.close();
            return m3u8Output;
        } catch (err) {
            this.logService.log(err, "error");
            await browser.close();
            return null;
        }
    }
}