const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(dateStr) {
    if (!DATE_REGEX.test(dateStr)) return false;
    const date = new Date(`${dateStr}T00:00:00`);
    return !isNaN(date.getTime());
}

function validateSearchPayload(body) {
    if (!body || typeof body !== 'object') {
        return { valid: false, message: 'Payload deve ser um objeto JSON com checkin e checkout' };
    }

    const { checkin, checkout } = body;

    if (checkin === undefined || checkout === undefined) {
        return { valid: false, message: 'Os campos "checkin" e "checkout" são obrigatórios' };
    }

    if (typeof checkin !== 'string' || typeof checkout !== 'string') {
        return { valid: false, message: 'checkin e checkout devem ser strings no formato YYYY-MM-DD' };
    }

    if (!isValidDate(checkin)) {
        return { valid: false, message: 'checkin inválido. Use o formato YYYY-MM-DD com uma data válida' };
    }

    if (!isValidDate(checkout)) {
        return { valid: false, message: 'checkout inválido. Use o formato YYYY-MM-DD com uma data válida' };
    }

    if (new Date(checkin) >= new Date(checkout)) {
        return { valid: false, message: 'checkout deve ser posterior a checkin' };
    }

    return { valid: true };
}

module.exports = { validateSearchPayload };
