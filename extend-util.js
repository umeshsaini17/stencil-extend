'use strict';

const { spawn } = require("child_process");
const fs = require('fs');
var path = require('path');

function init() {
    var myArgs = process.argv.slice(2);
    const st = spawn("stencil", ['build'].concat(myArgs), { shell: true });
    // const ls = spawn("ls", ['www/build']);  // To Test
    st.stdout.setEncoding('utf8');
    
    st.stdout.on("data", data => {
        console.log(data);  // Writing
        if(isBuildFinished(data)) {
            console.log('Extending Components...');
            console.log('-----------------------------------------------------');
            extendComponents(myArgs);
        }
    });
    
    st.stderr.on("data", data => {
        console.log(`stencil build - stderr: ${data}`);
    });
    
    st.on('error', (error) => {
        console.log(`stencil build - error: ${error.message}`);
    });
    
    st.on("close", code => {
        console.log(`\n--------------- Extension Process Completed -----------------\n`);
    });
}

function isBuildFinished(str) {
    return String(str).indexOf('build finished') >= 0;
}

function extendComponents(args) {
    let config = getExtendedComponentConfig();
    if(isDevBuild(args)) {
        executeInheritanceOnDevBuild(config);
    } else {
        executeInheritanceOnProdBuild(config);
    }
}

function isDevBuild(args) {
    return args && args.indexOf('--dev') >= 0;
}

function executeInheritanceOnDevBuild() {
    console.log('--- Executing Dev Build...')
}
function executeInheritanceOnProdBuild(config) {
    console.log('--- Executing Prod Build...');
    let dir = 'www/build';
    searchForEntityFilesInFolder(dir, config);
}

function searchForEntityFilesInFolder(dir, config) {
    console.log('--- Searching for files at: ' + dir);
    let cmd = 'ls';
    let params = [dir];
    if(isWinPlatform()) {
      cmd = 'dir';
      params = ['/b', path.normalize(dir)]
    }
    const ls = spawn(cmd, params, { shell: true });
    
    ls.stdout.setEncoding('utf8');
    ls.stdout.on("data", output => {
        let filesToProcess = extractComponentFileNames(output);

        filesToProcess.forEach(fileName => {
            console.log(`\n------ Processing file: ${fileName}`);
            let fileUrl = `${dir}/${fileName}`;
            let fileData = readFileSync(fileUrl);
            processFile(config, { fileName: fileUrl, fileOutput: String(fileData)});
            console.log(`------ Processing completed for file: ${fileName}`);
        });

    });
    
    ls.stderr.on("data", data => {
        console.log(`ExtendUtil - ls ${dir} - stderr: ${data}`);
    });
    
    ls.on('error', (error) => {
        console.log(`ExtendUtil - ls ${dir} - error: ${error.message}`);
    });
    
    ls.on("close", code => {
        //console.log(`ExtendUtil - ls ${dir} - child process exited with code ${code}`);
    });
}

function processFile(config, file) {
    iterateConfig(config, file);
}

function extractComponentFileNames(output) {
    if(output) {
    console.log('--- Extracting files to process...')
      let sep = isWinPlatform() ? '\r\n' : '\n';
        let files = output.split(sep);
        return files.filter((val) => {
            let regEx = new RegExp('p-[a-zA-Z0-9]*\.entry.js', 'g');
            return val.search(regEx) >= 0;
        });
    }
    else {
        return [];
    }
    
}

function getExtendedComponentConfig() {
    try {
        console.log('Reading file: extend-util.config.json');
        let configData = readFileSync('extend-util.config.json');
        let config = JSON.parse(configData);
        console.log('Config:-');
        console.log(config);
        if(config && config.extendingComponents && config.extendingComponents.length) {
            return config.extendingComponents;
        } else {
            return [];
        }
    } catch(ex) {
        console.error('Error occurred while fetching extend-util.config.json file. ' + JSON.stringify(ex));
    }
}

function iterateConfig(config, file) {
    console.log('--------- Processing file based on config...');
    if(config) {
        config.forEach((val) => {
            console.log(val);
            if(val && val.name && stringContainsName(val.name, file.fileOutput)) {
                if(val.from && stringContainsName(val.from, file.fileOutput)) {
                    let vars = getComponentVars(val, file.fileOutput);
                    console.log('--------- Extending Components in file...');
                    extendsFeatures(vars, file);
                } else {
                    console.error('EXTN: Component "' + val.name + '" does not implemented inheritance correctly. Component should import the parent component code for inheritance to work.');
                }
            } else {
                // The processing file does not have the component.
            }
        });
    }
}

function extendsFeatures({parent, child}, {fileName, fileOutput}) {
    let regExConstructor = new RegExp(`${child}\s*=\s*class\s*\{\s*constructor\s*[\(][ a-zA-Z0-9,]*[\)]\s*\{`, 'g');
    let matchConstructor = regExConstructor.exec(fileOutput);
    if(matchConstructor && matchConstructor.length) {
        fileOutput = fileOutput.replace(matchConstructor[0], `${matchConstructor[0]} this.__proto__.__proto__=${parent}.prototype;`);
        console.log(`------------ Updated component's inheritance.`);
    }

    let regExStyle = new RegExp(`${child}\s*=\s*class\s*\{\s*constructor\s*[\(][ a-zA-Z0-9,]*[\)]\s*\{(.*)}.*get style\s*[(]\s*[)]\s*\{\s*return`, 'g');
    let matchStyle = regExStyle.exec(fileOutput);
    if(matchStyle && matchStyle.length) {
        fileOutput = fileOutput.replace(matchStyle[0], `${matchStyle[0]} ${parent}.style + ' ' + `);
        console.log(`------------ Updated component's styles.`);
    }

    fileOutput = fileOutput.replace(/this.super/g, 'super');
    console.log(`------------ Updated this.super feature.`);

    console.log(`------------ Writing changes to file: ${fileName}`);
    writeFileSync(fileName, fileOutput);
    console.log(`------------ Write completed for file: ${fileName}`);
}

function stringContainsName(name, string) {
    let regEx = new RegExp('[{, ]([a-z]*) as ' + hiphenToUnderscore(name) + '[ ,}]', 'g');
    return string.search(regEx) >= 0;
}

function getComponentVars(val, fileOutput) {
    let parentVar = typeof val.from === 'string' ? hiphenToUnderscore(val.from) : null;
    let parent = findComponentVar(parentVar, fileOutput);
    let componentVar = typeof val.name === 'string' ? hiphenToUnderscore(val.name) : null;
    let child = findComponentVar(componentVar, fileOutput);

    return {parent: parent, child: child};
}

function findComponentVar(name, fileOutput) {
    let regEx = new RegExp('[{, ]([a-z]*) as ' + name + '[ ,}]', 'g');
    let match = regEx.exec(fileOutput);
    if(match && match.length > 1) {
        return match[1];
    }
    throw 'EXTN: Component variable name not found: ' + name + '. Please fix your extend-util.config.json file.';
}

function hiphenToUnderscore(tagName) {
    return tagName.replace(/-/g, '_');
}

function readFileSync(fileName) {
  fileName = path.normalize(fileName);
    return fs.readFileSync(fileName);
}

function writeFileSync(fileName, fileData) {
  fileName = path.normalize(fileName);
    fs.writeFileSync(fileName, fileData);
}

function isWinPlatform() {
  return process.platform === "win32";;
}

function log(string, style) {
    console.log(string);
}

init();

