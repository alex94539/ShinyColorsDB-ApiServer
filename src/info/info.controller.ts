import { Controller, Get, Header, HttpException, HttpStatus, NotFoundException, Query, UnprocessableEntityException } from '@nestjs/common';
import { InfoService } from './info.service';

@Controller('info')
export class InfoController {
  constructor(private infoService: InfoService) {}

  @Get('idollist')
  async getIdolList() {
    return await this.infoService.getIdollist();
  }

  @Get('idolinfo')
  async getIdolInfo(@Query('idolId') idolId: number) {
    if (isNaN(idolId) || idolId < 1 || idolId > 25) {
      throw new NotFoundException(`Idol Id ${idolId} not found`);
    }
    return await this.infoService.getIdolInfo(idolId);
  }

  @Get('unitinfo')
  async getUnitInfo() {
    return this.infoService.getUnitInfo();
  }

  @Get('pcardinfo')
  async getPCardInfo(@Query('cardId') cardId: string) {
    if (!cardId) {
      throw new UnprocessableEntityException('Card Id is required');
    }

    const thisCard = await this.infoService.getPCardInfo(cardId);

    if (thisCard) {
      return thisCard;
    }
    else {
      throw new NotFoundException(`Card Id ${cardId} not found`);
    }
  }

  @Get('scardinfo')
  async getSCardInfo(@Query('cardId') cardId: string) {
    if (!cardId) {
      throw new UnprocessableEntityException('Card Id is required');
    }

    const thisCard = await this.infoService.getSCardInfo(cardId);

    if (thisCard) {
      return thisCard;
    }
    else {
      throw new NotFoundException(`Card Id ${cardId} not found`);
    }
  }

  @Get('latestpinfo')
  async getLatestInfo() {
    return await this.infoService.getLatestPInfo();
  }

  @Get('latestsinfo')
  async getLatestSInfo() {
    return await this.infoService.getLatestSInfo();
  }

  @Get('updatehistory')
  async getUpdateHistory() {
    return await this.infoService.getUpdateHistory();
  }

  @Get('sitelist')
  @Header('Content-Type', 'text/xml')
  async getSiteList() {
    const iList = await this.infoService.getIdollist(),
      pList = await this.infoService.getPcardList(),
      sList = await this.infoService.getScardList();

    let siteStr = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    siteStr += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    siteStr += this.generateUrl('https://shinycolors.moe/');

    for (let i of iList) {
      siteStr += this.generateUrl(`https://shinycolors.moe/idolinfo?idolid=${i.idolId}`);
    }

    for (let p of pList) {
      siteStr += this.generateUrl(`https://shinycolors.moe/pcardinfo?uuid=${p.cardUuid}`);
    }

    for (let s of sList) {
      siteStr += this.generateUrl(`https://shinycolors.moe/scardinfo?uuid=${s.cardUuid}`);
    }

    siteStr += `</urlset>`;
    return siteStr;
  }

  generateUrl(url: string): string {
    return `<url><loc>${url}</loc></url>\n`;
  }
}
