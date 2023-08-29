/**
 * 去除代码注释
 */
const fs = require('fs');
const path = require('path');
const process = require('process');
const decomment = require('decomment');

let sourceFile = process.argv[2];
let targetFile = process.argv[3];
if (!sourceFile || !targetFile) {
    throw new Error('Please set source file and target file.');
}

sourceFile = path.resolve(__dirname, sourceFile);
targetFile = path.resolve(__dirname, targetFile);

fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) throw err;
    fs.writeFile(targetFile, decomment(data), 'utf8', (err, data) => {
        if (err) throw err;
        console.log('Remove Comments Done!');
    });
});
