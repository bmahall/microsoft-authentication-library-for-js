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

async function getModules() {
    const modules = fs.readdirSync('./lib');
    const moduleToNewVersion = {};

    for (let i in modules) {
        const module = modules[i];
        const diff = await runProcess('git', ['diff', `./lib/${module}/package.json`]);

        if (diff.trim().length < 1) continue;

        const lines = diff.split("\n")
            .filter(line => VERSION_DIFF_REGEX.test(line.trim()));
            
        const regexResult = VERSION_DIFF_REGEX.exec(lines);

        if (!regexResult) {
            throw new Error("Cannot parse version for module " + module)
        }

        const newVersion = regexResult[1];
        moduleToNewVersion[module] = newVersion;

    }

    return moduleToNewVersion;


};

function formatBumpedModuleMessage(moduleToNewVersion) {
    if (Object.keys(moduleToNewVersion) < 1) return '** No modules have been version-bumped **';

    const modList = Object.keys(moduleToNewVersion)
        .map(module => `- ${module}: ${moduleToNewVersion[module]}`)
        .join("%0A")

    return `The following modules have had their versions bumped: %0A ${modList}`
}

process.on('unhandledRejection', (e) => {
    console.error("An error has occurred", e);
    process.exit(-1);
});

(async () => {
    console.log(formatBumpedModuleMessage(await getBumpedModules()));
})();

