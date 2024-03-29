<img src="./shellfies/logo.png" />   

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
        await snap(stdout, 'snapshot name');
    });
});
```

all consequential tests from this file will be compared to the snapshot.

> while snapshot name is optional, it is highly recommended.   
> if you do not provide a snapshot name, snaptdout will save the line and column of the running test as keys in the `.json` file.

# config 
you can provide config through your `package.json`, like so:

```json
...
"snaptdout": {
    "snapshotsDir": "relative/to/root/project/directory"
}
...
```

you can also provide the config as a third paremeter.
snapshot specific config overrides any global config.
```javascript
const stdout = '\x1b[32;7mHEY THERE\x1[0m';
await snap(stdout, 'hey', {ignoreAnsi: true});
```

##  `snapshotsDir`
snapshots directory.   
under this directory all snapshots files will be saved.

> default: test file location.

##  `snapshotsPrefix`
snapshots file prefix.   

> default: ''.

##  `ignoreAnsi`
ignore ansi formatting characters (`\x1b[32m` || `[32m`).   
if set to `true` - `snaptdout` will save the raw string without formatting and use that for future comparisons.   

> default: false.

##  `formattedOutput`
show formatted output after error message.   

> default: true.

# features
## lightweight
`snaptdout` has no dependencies, and a minimal footprint.

## 0 setup
you can simply `require` / `import` `snaptdout` and use it out of the box.

## simple.
`snaptdout` uses simple `.json` files to store the string we refer to as a `snapshot`.   
no binaries. nothing fancy.

## great diffs
when output based tests break, you need to know **exactly** where.   
[![](https://img.shields.io/static/v1?label=created%20with%20shellfie&message=📸&color=pink)](https://github.com/tool3/shellfie)   

![](./img/error.png)

# examples
yargs cli test example
```javascript
const {exec} = require('child_process');
const execute = require('util').promisify(exec);
const snap = require('snaptdout');

describe(('help test') => {
    it('should show the correct help text', async () => {
        const {stdout} = await execute('node index.js --help');
        await snap(stdout, 'help');
    });
});
```

ignore ansi characters for specific test
only tests for text and spacing
```javascript
await snap('randomly formatted string', 'snapshot name', {ignoreAnsi: true});
```