const snap = require('../snap');
const chartscii = require('chartscii')
const assert = require('assert');

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

    it('should throw with empty input', async() => {
        try {
            await snap('', 'fail');
        } catch (error) {
            assert.strictEqual(error.message, 'value is empty or undefined');
        }
    });


    it('should throw with non-string input', async() => {
        try {
            await snap(1234124124124, 'fail');
        } catch (error) {
            assert.strictEqual(error.message, 'value must be a string');
        }
    });

    it('should support ansi output', async() => { 
        await snap(`\x1b[31mhello this is red\x1b[0m\n\x1b[32mthis is yellow\x1b[0m`, 'colors');
    });
});