const puppeteer = require("puppeteer-extra")
const devices = require('puppeteer/DeviceDescriptors');
const iPhonex = devices['iPhone X'];
const pluginStealth = require("puppeteer-extra-plugin-stealth")

puppeteer.use(pluginStealth())

class Signer {
  userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
  args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
    '--ignore-certifcate-errors',
    '--ignore-certifcate-errors-spki-list',
  ]
  constructor(userAgent) {
    if (userAgent) {
      this.userAgent = userAgent
    }

    this.args.push(`--user-agent="${this.userAgent}"`)

    this.options = {
      args: this.args,
      headless: true,
      ignoreHTTPSErrors: true,
      userDataDir: './tmp'
    };
  }

  async init() {
    this.browser = await puppeteer.launch(this.options);
    this.page = await this.browser.newPage();
    await this.page.goto('file://' + __dirname + '/index.html', { waitUntil: 'load' });
    await this.page.emulate(iPhonex);

    return this
  }

  async sign(str) {
    let res = await this.page.evaluate(`generateSignature("${str}")`)
    return res
  }

  async close() {
    await this.browser.close();
    this.browser = null
    this.page = null
  }
}

module.exports = Signer;
