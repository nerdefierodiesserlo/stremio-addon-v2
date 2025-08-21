import { Domain } from '@models/Domain';
import { BASE_DIR } from '@config/paths';
import fs from 'fs';
import path from 'path';
const domainsFile = path.join(BASE_DIR, 'data/domains.json'); 

export class DomainService {
    static getDomain(code: string): Domain | null {
        let domains = this.readDomains();
        return domains.find(d => d.code === code) || null;
    }

    static getDomainIndex(code: string): number {
        let domains = this.readDomains();
        return domains.findIndex(d => d.code === code);
    }

    static getAllDomains(): Domain[] {
        return this.readDomains();
    }

    static async getActiveDomains() {
        return this.getAllDomains().filter(domain => domain.active == true);
    }

    static async updateDomainByCode(code: string, domainObj: Domain) {
        let domains = DomainService.getAllDomains();
        let index = DomainService.getDomainIndex(code);
        if (index !== -1) {
            domains[index] = domainObj;
            DomainService.writeDomains(domains);
        }
    }
    
    static readDomains(): Domain[] {
        if (!fs.existsSync(domainsFile)) return [];
        const content = fs.readFileSync(domainsFile, 'utf-8');
        return JSON.parse(content);
    }

    static writeDomains(domains: Domain[]) {
        if (!fs.existsSync(domainsFile)) return;
        fs.writeFileSync(domainsFile, JSON.stringify(domains, null, 2), 'utf-8');
    }
}