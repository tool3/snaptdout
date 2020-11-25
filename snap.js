const fs = require('fs').promises;
const path = require('path')

async function exists(path) {
    try {
        return await fs.access(path) === undefined;
    } catch (error) {
        return false;
    }
}

async function snapShotFileExists(path) {
    return await exists(path) ? require(path) : false;
}

function error({expected, actual}) {
    const errString = `${' '.repeat(6)}\x1b[32mexpect: ${expected}\x1b[0m\n${' '.repeat(6)}\x1b[31mactual: ${actual}\x1b[0m`
    const errorMessage = `snapshots don't match!\n${errString}`
    throw new Error(errorMessage)
}

async function validateSnapshot(testValue, existingSnap) {
    for (const [i, line] of existingSnap.entries()) {
        if (line !== testValue[i]) {
            const expected = existingSnap[i];
            const actual = testValue[i];
            error({expected, actual})
        }
    }
}

function getCallSite() {
    const originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    Error.captureStackTrace(err, global);
    const callSite = err.stack[3];
    Error.prepareStackTrace = originalPrepareStackTrace;
    return callSite;
}

function getStackFileName() {
    const callSite = getCallSite();
    const lineNum = callSite.getLineNumber();
    const colNum = callSite.getColumnNumber();
    const filePath = callSite.getFileName();
    
    const lineNumber = `${lineNum}:${colNum}`;
    const fullPath = path.resolve(filePath).replace('.js', '.json')

    const folderPath = fullPath.split('/')
    const folder = folderPath.slice(0, folderPath.length - 1).join('/');
    const writePath = `${folder}/snapshots/${folderPath.slice(-1)[0]}`

    return { writePath, folder, lineNumber };
}

async function makeFolder(folder) {
    const snapshotsDir = `${folder}/snapshots`;
    if (!await exists(snapshotsDir)) {
        await fs.mkdir(snapshotsDir);
    }
}

async function writeJson(path, json) {
    await fs.writeFile(path, JSON.stringify(json, null, 2));
}

async function snap(value) {
    const splittedValue = value.split('\n')
    const {writePath, folder, lineNumber} = getStackFileName();
    const existingSnap = await snapShotFileExists(writePath)
    const snap = existingSnap || {};
    if (snap[lineNumber]) {
        return await validateSnapshot(splittedValue, snap[lineNumber]); 
    } else {
        snap[lineNumber] = splittedValue;
    }
    
    await makeFolder(folder);
    await writeJson(writePath, snap)
}

module.exports = snap;