const puppeteer = require('puppeteer');

class BrowserService { // abre e fecha o navegador

    static getBrowser() {
        return puppeteer.launch({});
    }

    static closeBrowser(browser) {
        if (!browser) {
            return;
        }
        return browser.close();
    }
}

module.exports = BrowserService;
