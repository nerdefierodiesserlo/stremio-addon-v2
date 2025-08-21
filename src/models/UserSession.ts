import puppeteer, { Browser, Page, Cookie, LaunchOptions } from 'puppeteer';
import LogService from '@services/LogService';

interface Headers {
    [key: string]: string;
}

export default class UserSession {
    headers: Headers | null = null;
    userAgent: string | null = null;
    cookies: Cookie[] | null = null;
    logService = LogService;

    async createSession(pageUrl: string, unsafelyOrigins: string[]): Promise<void> {
        const browser = await this.launchBrowser(unsafelyOrigins);
        try {
            const page: Page = await browser.newPage();
            await page.setExtraHTTPHeaders({ 'Upgrade-Insecure-Requests': '0' });
            this.logService.log("vado sul sito", "debug");
            await page.goto(pageUrl);
            this.logService.log("Prendo le info", "debug");
            this.cookies = await page.cookies();
            this.userAgent = await page.evaluate(() => navigator.userAgent);
            this.headers = {
                "User-Agent": this.userAgent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6",
                "Accept-Encoding": "gzip, deflate, br",
                "Cookie": this.cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')
            };
        } catch (error) {
            this.logService.log(error, "error");
        } finally {
            this.logService.log("chiudo", "debug");
            await browser.close();
        }
    }

    async launchBrowser(unsafelyOrigins: string[]): Promise<Browser> {
        let args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-features=UpgradeInsecureRequests',
            '--disable-features=BlockInsecurePrivateNetworkRequests',
            '--allow-running-insecure-content',
            '--ignore-certificate-errors'
        ];
        if (unsafelyOrigins && unsafelyOrigins.length>0) {
            args.push(`--unsafely-treat-insecure-origin-as-secure=${unsafelyOrigins.join(",")}`);
        }
        const puppeteerConfig: LaunchOptions = {
            headless: true,
            args
        };

        if (process.env.PUPPETEER_PATH) {
            puppeteerConfig.executablePath = process.env.PUPPETEER_PATH;
        }

        return await puppeteer.launch(puppeteerConfig);
    }
}