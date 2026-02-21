const SearchService = require('../../services/SearchService');

describe('SearchService', () => {
    const originalEnv = process.env.BASE_URL;

    afterEach(() => {
        process.env.BASE_URL = originalEnv;
    });

    describe('buildUrl', () => {
        beforeEach(() => {
            process.env.BASE_URL = 'https://reservations.fasthotel.me/188/214';
        });

        it('monta a URL com checkin e checkout e fragmento acomodacoes', () => {
            const url = SearchService.buildUrl('2025-03-01', '2025-03-05');
            expect(url).toBe(
                'https://reservations.fasthotel.me/188/214?entrada=2025-03-01&saida=2025-03-05&adultos=1#acomodacoes'
            );
        });

        it('inclui entrada, saida, adultos e hash', () => {
            const url = SearchService.buildUrl('2025-06-15', '2025-06-20');
            expect(url).toContain('entrada=2025-06-15');
            expect(url).toContain('saida=2025-06-20');
            expect(url).toContain('adultos=1');
            expect(url).toContain('#acomodacoes');
        });
    });
});
