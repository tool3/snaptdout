const snap = require('../snap');
const chartscii = require('chartscii')

describe('snapshot testing', () => {
    it('should snapshot stdout', async () => {
        const stdout = ` 
        this is a 
        "complicated" cli
        str ing
        `
        await snap(stdout, 'complicated');
    });

    it('should support emojis', async () => {
        const stdout = 'works with 🤪'
        await snap(stdout);
    });

    it('should support special characters', async () => {
        const stdout = `!@#$%^&*()_-=+~`
        await snap(stdout, 'special chars');
    })

    it('should support fancy examples', async () => {
        const data = [];

        for (let i = 1; i <= 20; i++) {
            data.push(i);
        }

        const chart = new chartscii(data, {
            width: 200,
            sort: true,
            reverse: true
        });

        const stdout = chart.create();
        await snap(stdout);
    })

    it('should support delicate strings', async () => {
        const stdout = `
        ______     __   __     ______     ______   ______   _____     ______     __  __     ______  
        /\  ___\   /\ "-.\ \   /\  __ \   /\  == \ /\__  _\ /\  __-.  /\  __ \   /\ \/\ \   /\__  _\ 
        \ \___  \  \ \ \-.  \  \ \  __ \  \ \  _-/ \/_/\ \/ \ \ \/\ \ \ \ \/\ \  \ \ \_\ \  \/_/\ \/ 
         \/\_____\  \ \_\\"\_\  \ \_\ \_\  \ \_\      \ \_\  \ \____-  \ \_____\  \ \_____\    \ \_\ 
          \/_____/   \/_/ \/_/   \/_/\/_/   \/_/       \/_/   \/____/   \/_____/   \/_____/     \/_/ 
                                                                                                     
        `;
        
        await snap(stdout);
    })
});