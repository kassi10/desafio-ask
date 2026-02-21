const { validateSearchPayload } = require('../../utils/validateSearchPayload');

describe('validateSearchPayload', () => {
    it('retorna válido para checkin e checkout corretos', () => {
        expect(validateSearchPayload({ checkin: '2025-03-01', checkout: '2025-03-05' })).toEqual({ valid: true });
    });

    it('retorna inválido quando body é null', () => {
        const result = validateSearchPayload(null);
        expect(result.valid).toBe(false);
        expect(result.message).toMatch(/Payload deve ser um objeto JSON/);
    });

    it('retorna inválido quando body não é objeto', () => {
        expect(validateSearchPayload('string').valid).toBe(false);
        expect(validateSearchPayload(123).valid).toBe(false);
    });

    it('retorna inválido quando faltam checkin ou checkout', () => {
        expect(validateSearchPayload({})).toEqual({
            valid: false,
            message: 'Os campos "checkin" e "checkout" são obrigatórios',
        });
        expect(validateSearchPayload({ checkin: '2025-03-01' })).toEqual({
            valid: false,
            message: 'Os campos "checkin" e "checkout" são obrigatórios',
        });
        expect(validateSearchPayload({ checkout: '2025-03-05' })).toEqual({
            valid: false,
            message: 'Os campos "checkin" e "checkout" são obrigatórios',
        });
    });

    it('retorna inválido quando checkin/checkout não são strings', () => {
        const result = validateSearchPayload({ checkin: 20250301, checkout: '2025-03-05' });
        expect(result.valid).toBe(false);
        expect(result.message).toMatch(/strings no formato YYYY-MM-DD/);
    });

    it('retorna inválido para checkin em formato inválido', () => {
        const result = validateSearchPayload({ checkin: '01-03-2025', checkout: '2025-03-05' });
        expect(result.valid).toBe(false);
        expect(result.message).toMatch(/checkin inválido/);
    });

    it('retorna inválido para data inexistente', () => {
        expect(validateSearchPayload({ checkin: '2025-02-30', checkout: '2025-03-05' }).valid).toBe(false);
        expect(validateSearchPayload({ checkin: '2025-03-01', checkout: '2025-13-01' }).valid).toBe(false);
    });

    it('retorna inválido quando checkout não é posterior a checkin', () => {
        const result = validateSearchPayload({ checkin: '2025-03-05', checkout: '2025-03-01' });
        expect(result.valid).toBe(false);
        expect(result.message).toMatch(/checkout deve ser posterior a checkin/);
    });

    it('retorna inválido quando checkin e checkout são iguais', () => {
        const result = validateSearchPayload({ checkin: '2025-03-01', checkout: '2025-03-01' });
        expect(result.valid).toBe(false);
    });
});
