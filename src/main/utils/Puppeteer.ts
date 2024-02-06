/* eslint-disable prettier/prettier */
// @ts-nocheck
import puppeteer from 'puppeteer';
import chromePaths from 'chrome-paths';

export default class Puppeteer {
  constructor(private browser: any) {
    this.browser = browser;
  }

  static async build() {
    const browser = await puppeteer.launch({
      executablePath: chromePaths.chrome,
      headless: true,
      devtools: false,
      defaultViewport: null,
      ignoreHTTPSErrors: true,
      args: ['--fast-start', '--disable-extensions', '--no-sandbox'],
    });
    return new Puppeteer(browser);
  }

  async checkPage(link: string, code: string) {
    const pages = await this.browser.pages();
    const page = pages[0];
    await page.goto(link, { waitUntil: 'load', timeout: 0 });
    const siteDetails = await page.evaluate(async (codeLocal) => {
      const errors = [];
      try {
        // eslint-disable-next-line no-eval
        eval(codeLocal);
      } catch (err) {
        errors.push(err.message);
      }
      return errors;
    }, code);

    this.browser.close();
    return siteDetails;
  }
}
