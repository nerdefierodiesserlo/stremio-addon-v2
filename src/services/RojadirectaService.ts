import {AbstractStreamingService } from '@services/AbstractStreamingService';
import StreamObject from '@models/StreamObject';
import { ChannelLink } from '@models/ChannelLink';
import { Meta } from '@models/Meta';

export class RojadirectaService extends AbstractStreamingService {
    constructor(mediaType: string, protocol: string, host: string) {
        super('rojadirecta', mediaType, protocol, host);
    }

    async getMediaLinks(id: string): Promise<StreamObject[]> {
        let streamList: StreamObject[] = [];
        try {
            const mediaId = id.replace("havestream-rojadirecta-", "");
            if (mediaId) {
                const headers = this.userSession.headers ?? {};
                const response = await this.client.get(this.baseURL, { headers });
                const $ = this.cheerio.load(response.data);

                const elements = Array.from($('#agendadiv span.list > span'));
                const el = elements[parseInt(mediaId)];
                let channelLinkList: ChannelLink[] = Array.from($(el).find('span span.submenu table tbody tr'))
                    .map(row => {
                        const cells = Array.from($(row).find('td'));
                        const name = $(cells[1]).text().trim() || null;
                        const lang = $(cells[2]).text().trim() || null;
                        const link = $(cells[5]).find('a').first().attr('href') || null;
                        return { name, lang, link };
                    })
                    .filter(e => e.link && e.name && e.lang)
                    .sort((a, b) => {
                        if (a.lang === 'it' && b.lang !== 'it') return -1;
                        if (a.lang !== 'it' && b.lang === 'it') return 1;
                        return 0;
                    });

                await Promise.all(channelLinkList.map(async (stream) => {
                    const m3u8Object = await this.sniffM3u8(stream.link!);
                    if (m3u8Object && !m3u8Object.content.includes('#EXT-X-KEY')) {
                        streamList.push(new StreamObject(m3u8Object.url, true)
                            .setStreamService('generic')
                            .setOrigin(m3u8Object.origin)
                            .setReferer(m3u8Object.referer)
                            .setTitle(`${stream.name} (${stream.lang})`));
                    }
                }));
            }
        } catch (error) {
            this.logService.log(error, 'error');
        }
        return streamList;
    }

    async getChannelList(): Promise<any[]> {
        const headers = this.userSession.headers ?? {};
        const response = await this.client.get(this.baseURL, { headers });
        const $ = this.cheerio.load(response.data);

        const elements = Array.from($('#agendadiv span.list > span'));
        const channels = await Promise.all(elements.map(async (el, index) => {
            const time = $(el).find('span.t').first().text().replace(/\s+/g, ' ').trim();
            const title = $(el).find('span[itemprop="name"]').text().replace(/\s+/g, ' ').trim();
            return {
                id: `havestream-rojadirecta-${index}`,
                name: `(${time}) ${title}`,
                description: 'Nessuna descrizione disponibile',
                type: 'tv',
                posterShape: 'square'
            };
        }));

        return channels;
    }

    async getTvChannelMeta(id: string): Promise<Meta> {
        const mediaId = id.replace("havestream-rojadirecta-", "");
        let meta = {
            id,
            name: `Nessun nome trovato`,
            description: 'Nessuna descrizione disponibile',
            type: 'tv',
            poster: null,
            genres: null
        };
        if (mediaId) {
            const headers = this.userSession.headers ?? {};
            const response = await this.client.get(this.baseURL, { headers });
            const $ = this.cheerio.load(response.data);

            const elements = Array.from($('#agendadiv span.list > span'));
            const el = elements[parseInt(mediaId)];
            const time = $(el).find('span.t').first().text().replace(/\s+/g, ' ').trim();
            const title = $(el).find('span[itemprop="name"]').text().replace(/\s+/g, ' ').trim();
            meta.name = `(${time}) ${title}`;
        }
        return meta;
    }
}