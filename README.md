# snaptdout
[![](https://github.com/tool3/snaptdout/workflows/test/badge.svg?branch=master)](https://github.com/tool3/snaptdout/actions?query=workflow:test)    
simple stdout snapshot testing

# install
`npm i -D snaptdout`

# how does it work ?
snaptdout saves a copy of stdout to a `.json` file equivalent to the test file name, which should be committed to git.

# usage
snaptdout is a drop-in snapshot testing tool, you can use it in any testing framework by simply calling it with the expected `stdout`:

```javascript
describe('snapshot testing', () => {
    it('should snapshot stdout', async () => {
        const stdout = ` 
        this is a 
        complicated cli
        str ing
        `
        await snap(stdout);
    });
});
```

all consequential tests from this file will be compared to the snapshot.

> NOTE: snaptdout saves the line and column of the running test as keys in the `.json` file - so refactoring will require recreation of the snapshots.