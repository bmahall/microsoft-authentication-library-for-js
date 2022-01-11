const { spawn } = require("child_process")
const fs = require('fs');
const process = require('process')

async function runProcess(command, args) {
    const p = spawn(command, args)
    let output = '';
    p.stdout.on("data", data => {
        output += data.toString()
    });


    return new Promise((resolve, reject) => {
        p.on('exit', (code) => {
            if (code !== 0) {
                return reject(code);
            }

            resolve(output)
        })
    });
}

const VERSION_DIFF_REGEX = /^\+\s*"version":\s*"([0-9\.]+)".*$/
const VERSION_DIFF_OLD_REGEX = /^\-\s*"version":\s*"([0-9\.]+)".*$/
var modList = []

async function getBumpedModules() {
    const modules = fs.readdirSync('./lib');
    const moduleToNewVersion = {};
    const moduleToOldVersion = {};

    for (let i in modules) {
        const module = modules[i];
        const diff = await runProcess('git', ['diff', `./lib/${module}/package.json`]);

        if (diff.trim().length < 1) continue;

        const lines = diff.split("\n")
            .filter(line => VERSION_DIFF_REGEX.test(line.trim()));

        const lines_old = diff.split("\n")
            .filter(line => VERSION_DIFF_OLD_REGEX.test(line.trim()));

        // console.log(lines_old);

        const [line] = lines;
        var [line_old] = lines_old;
        const regexResult = VERSION_DIFF_REGEX.exec(line);

        if (!regexResult || !regexResult[1]) {
            throw new Error("Cannot parse version for module " + module)
        }


        line_old = line_old.split(':')[1].replace(/,/g, "");
        line_old = line_old.replace(/"/g, "").trim();

        const newVersion = regexResult[1];
        const oldVersion = line_old;

        moduleToNewVersion[module] = newVersion;
        moduleToOldVersion[module] = oldVersion;

    }


    // console.log(moduleToNewVersion);
    modList = Object.keys(moduleToOldVersion)
        .map(module => `| ${module} | ${moduleToOldVersion[module]} |  ${moduleToNewVersion[module]} |`)
        .join("\n| :---: | :---: | :---: |\n");

    console.log(modList);

    return `The following modules have had their versions bumped: %0A ${modList}`


};

(async () => {
    getBumpedModules();
})();