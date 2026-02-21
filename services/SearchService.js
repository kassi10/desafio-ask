const BrowserService = require('./BrowserService');

const BASE_URL = process.env.BASE_URL;

class SearchService {

    static buildUrl(checkin, checkout) {
        const entrada = encodeURIComponent(checkin); // encode evita problemas com caracteres especiais e datas
        const saida = encodeURIComponent(checkout);
        return `${BASE_URL}?entrada=${entrada}&saida=${saida}&adultos=1#acomodacoes`;
    }

    static async search(checkin, checkout) {
        let browser = null;

        try {
            browser = await BrowserService.getBrowser(); // inicializa o browser
            const page = await browser.newPage(); // cria uma nova aba

            const url = this.buildUrl(checkin, checkout); // constroi a url da página
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 }); // vai para a página

            const ROOM_SELECTOR = 'section[data-name="acomodacoes"] .row.borda-cor[data-codigo]';
            await page.waitForSelector(ROOM_SELECTOR, { timeout: 15000 });

            const rooms = await page.evaluate((selector) => {
                const cards = document.querySelectorAll(selector);
                const results = [];

                cards.forEach(card => {
                    const nameEl = card.querySelector('h3[data-campo="titulo"]');
                    const name = nameEl ? nameEl.textContent.trim() : '';

                    const descEl = card.querySelector('.quarto.descricao');
                    const description = descEl ? descEl.textContent.trim() : '';

                    const imgEl = card.querySelector('.flexslider img');
                    const image = imgEl ? imgEl.src : '';

                    const priceEl = card.querySelector('[data-campo="tarifas"] b[data-campo="valor"]');
                    const price = priceEl ? priceEl.textContent.trim() : '';

                    results.push({ name, description, price, image });
                });

                return results;
            }, ROOM_SELECTOR);

            if (!rooms.length) {
                throw new Error('No rooms found');
            }

            return rooms;
        } finally {
            await BrowserService.closeBrowser(browser);
        }
    }
}

module.exports = SearchService;
