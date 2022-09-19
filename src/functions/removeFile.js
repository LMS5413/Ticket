const { existsSync, rmdirSync, lstatSync } = require('fs');

function removeFile(path) {
    if (existsSync(path)) {
        readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (lstatSync(curPath).isDirectory()) {
                removeFile(curPath);
            } else {
                unlinkSync(curPath);
            }
        });
        rmdirSync(path);
    }
};
module.exports = removeFile