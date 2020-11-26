const snap = require('../snap');

describe('snapshot testing', () => {
    it('should snapshot stdout', async () => {
        const stdout = ` 
        this is a 
        complicated cli
        str ing
        `
        await snap(stdout);
    });

    it('should support emojis', async () => {
        const stdout = 'works with 🤪'
        await snap(stdout);
    });

    it('should support special characters', async () => {
        const stdout = `!@#$%^&*()_-=+~`
        await snap(stdout);
    })
});