const request = require('supertest');
const SearchService = require('../../services/SearchService');

jest.mock('../../services/SearchService');

const app = require('../../server');

describe('POST /search (e2e)', () => {
    it('retorna 400 quando body está vazio', async () => {
        const res = await request(app).post('/search').send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toMatch(/obrigatórios|checkin|checkout/);
    });

    it('retorna 400 quando datas são inválidas', async () => {
        const res = await request(app)
            .post('/search')
            .send({ checkin: '2025-03-10', checkout: '2025-03-05' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/posterior a checkin/);
    });

    it('retorna 200 e array de quartos quando payload é válido e service retorna dados', async () => {
        const rooms = [
            { name: 'Quarto Test', description: 'Desc', price: 'R$ 150', image: 'https://example.com/img.jpg' },
        ];
        SearchService.search.mockResolvedValue(rooms);

        const res = await request(app)
            .post('/search')
            .send({ checkin: '2025-04-01', checkout: '2025-04-05' });

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toMatchObject({
            name: 'Quarto Test',
            description: 'Desc',
            price: 'R$ 150',
            image: 'https://example.com/img.jpg',
        });
        expect(SearchService.search).toHaveBeenCalledWith('2025-04-01', '2025-04-05');
    });

    it('retorna 500 quando o service lança erro', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        SearchService.search.mockRejectedValue(new Error('No rooms found'));

        const res = await request(app)
            .post('/search')
            .send({ checkin: '2025-04-01', checkout: '2025-04-05' });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'Falha ao buscar quartos disponíveis' });
        consoleSpy.mockRestore();
    });
});
