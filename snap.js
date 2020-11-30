const fs = require('fs').promises;
const path = require('path');

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m',
    red_underlined: '\x1b[31;4m',
    green_underlined: '\x1b[32;4m'
}

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

function indentResult(msg, color, repeat) {
    return `${colors.reset}\n${repeat ? ' '.repeat(repeat) : ''}${colorize(msg, color)}`;
}

function colorize(msg, color) {
    return `${colors.reset}${color}${msg}${colors.reset}`;
}

function error({expect, actual}) {
    const expectString = indentResult(`expect: ${expect}`, colors.green, 6);
    const actualString = indentResult(`actual: ${actual}`, colors.red, 6);
    const errorMessage = `snapshots don't match!\n${expectString + actualString}`;
    throw new Error(errorMessage);
}

async function validateSnapshot(testValue, existingSnap) {
    existingSnap.forEach((line, index) => {
        if (line !== testValue[index]) {
            let actual = '';
            let expect = '';
            for (let i = 0; i < testValue[index].length; i++) {
                if (line[i] !== testValue[index][i]) {
                    actual += colorize(testValue[index][i], colors.red_underlined);
                    expect += colorize(line[i], colors.green_underlined);
                } else {
                    actual += colorize(testValue[index][i], colors.red);
                    expect += colorize(line[i], colors.green);
                }
            }
        
            error({expect, actual})
        }
    });
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

function jsonify(path) {
    const file = path.split('.')
    return `${file.splice(0, file.length - 1).join('.')}.json`
}

function getStack() {
    const callSite = getCallSite();
    const lineNumber = callSite.getLineNumber();
    const columnNumber = callSite.getColumnNumber();
    const filePath = callSite.getFileName();
    
    return { filePath, lineNumber, columnNumber }
}

function stringifyStack(stack, snapConfig) {
    const {filePath, lineNumber, columnNumber} = stack;
    const position = `${lineNumber}:${columnNumber}`;
    const fullPath = jsonify(path.resolve(filePath))

    const folderPath = fullPath.split('/')
    const folder = folderPath.slice(0, folderPath.length - 1).join('/');
    const { snapshotsDir, snapshotsPrefix } = snapConfig ? snapConfig : { snapshotsDir: folder, snapshotsPrefix: ''};
    const dir = path.resolve(snapshotsDir || folder);
    const writePath = `${dir}/snapshots/${snapshotsPrefix}${folderPath.slice(-1)[0]}`
    return { writePath, folder, position };
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

function getSnapConfig() {
    const userPackage = process.env.INIT_CWD ? `${process.env.INIT_CWD}/package.json` : undefined;
    const package = userPackage ? require(userPackage) : undefined;
    if (package && package.snaptdout) {
        return package.snaptdout;
    }
}

function validInput(value) {
    if (!value) {
        throw new Error('value is empty or undefined');
    }

    if (typeof value !== "string") {
        throw new Error('value must be a string');
    }
    
    return true;
}

async function snap(stdout, name) {
    if (validInput(stdout)) {
        let stdoutLines = stdout.split('\n');
        const snapConfig = getSnapConfig();
        const { writePath, folder, position } = stringifyStack(getStack(), snapConfig);
        const existingSnap = await snapShotFileExists(writePath)
        const snapshot = existingSnap || {};

        const key = name || position;
        if (snapshot[key]) {
            await validateSnapshot(stdoutLines, snapshot[key]); 
        } else {
            snapshot[key] = stdoutLines;
        }
        
        await makeFolder(folder);
        await writeJson(writePath, snapshot)
    }
}

module.exports = snap;