const { validateSearchPayload } = require('../utils/validateSearchPayload');
const SearchService = require('../services/SearchService');

const search = async (req, res) => {
    const validation = validateSearchPayload(req.body);

    if (!validation.valid) {
        return res.status(400).json({ error: validation.message });
    }

    const { checkin, checkout } = req.body;

    try {
        const rooms = await SearchService.search(checkin, checkout);
        return res.json(rooms);
    } catch (error) {
        console.error('Search failed:', error.message);
        return res.status(500).json({ error: 'Falha ao buscar quartos disponíveis' });
    }
};

module.exports = { search };
