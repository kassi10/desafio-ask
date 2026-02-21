const SearchService = require('../../services/SearchService');

jest.mock('../../services/SearchService');

const { search } = require('../../controllers/SearchController');

describe('SearchController.search', () => {
    let req;
    let res;
    let jsonMock;
    let statusMock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        res = { status: statusMock, json: jsonMock };
    });

    it('retorna 400 quando validação falha (body vazio)', async () => {
        req = { body: {} };
        await search(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Os campos "checkin" e "checkout" são obrigatórios' });
        expect(SearchService.search).not.toHaveBeenCalled();
    });

    it('retorna 400 quando checkout é anterior a checkin', async () => {
        req = { body: { checkin: '2025-03-10', checkout: '2025-03-05' } };
        await search(req, res);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'checkout deve ser posterior a checkin' });
        expect(SearchService.search).not.toHaveBeenCalled();
    });

    it('retorna 200 com array de quartos quando SearchService retorna sucesso', async () => {
        const rooms = [
            { name: 'Quarto A', description: 'Desc A', price: 'R$ 100', image: 'http://img.com/a.jpg' },
        ];
        SearchService.search.mockResolvedValue(rooms);
        req = { body: { checkin: '2025-03-01', checkout: '2025-03-05' } };
        await search(req, res);
        expect(SearchService.search).toHaveBeenCalledWith('2025-03-01', '2025-03-05');
        expect(jsonMock).toHaveBeenCalledWith(rooms);
        expect(statusMock).not.toHaveBeenCalled();
    });

    it('retorna 500 quando SearchService lança erro', async () => {
        SearchService.search.mockRejectedValue(new Error('No rooms found'));
        req = { body: { checkin: '2025-03-01', checkout: '2025-03-05' } };
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await search(req, res);
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Falha ao buscar quartos disponíveis' });
        consoleSpy.mockRestore();
    });
});
