const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(dateStr) {
    if (!DATE_REGEX.test(dateStr)) return false;
    const [year, month, day] = dateStr.split('-').map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31) return false;
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return false;
    // rejeita datas inexistentes (ex: 30/02 vira 02/03; mês 13 vira jan/ano seguinte)
    const sameYear = date.getFullYear() === year;
    const sameMonth = date.getMonth() === month - 1;
    const sameDay = date.getDate() === day;
    return sameYear && sameMonth && sameDay;
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
