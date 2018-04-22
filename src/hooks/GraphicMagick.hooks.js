// A hook that check if a file exists or not on the server
const fs = require("fs");

module.exports = function() {
    return async function(hook) {
        var filePath = undefined;

        if (hook.id) {
            filePath = hook.id;
        } else if (hook.data) {
            filePath = hook.data.image;
        }

        return new Promise(function(resolve, reject) {
            if (filePath) {
                fs.stat(fs.realpathSync(filePath), function(err, stat) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                reject(new Error("Image id \"" + filePath + "\" not on the server"));
            }
        });
    };
};