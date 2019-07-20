const path = require('path');
const _ = require('lodash');

module.exports.getWithCallee = getWithCallee;

function getWithCallee(error, calleeName, fileName) {
    try {
        let e = error;

        addCallee(e, calleeName, fileName);

        return e;

    } catch (err) {
        err.callee = [`${arguments.callee.name} (${__filename})`];
        console.error(err); // eslint-disable-line no-console
        return;
    }
}

function addCallee(error, calleeName, fileName) {
    try {
        if (error.callee == undefined) {
            error.callee = [];
        }

        if (calleeName == undefined && fileName == undefined) {
            return;
        }

        let callee = `${calleeName} (${getRelativePathFile(fileName)})`;

        error.callee = _.concat(callee, error.callee);

    } catch (err) {
        err.callee = [`${arguments.callee.name} (${__filename})`];
        console.error(err); // eslint-disable-line no-console
        return;
    }
}

function getRelativePathFile(p) {
    try {
        if (p == undefined) {
            p = __filename;
        }

        let appDir = path.resolve(__dirname, '..') + '/';
        p = p.replace(appDir, '');

        return p;

    } catch (err) {
        err.callee = [`${arguments.callee.name} (${__filename})`];
        console.error(err); // eslint-disable-line no-console
        return;
    }
}
