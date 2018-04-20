// A hook that check if a file exists or not on the server
const fs = require("fs");
const path = require("path");
const uploadsDir = fs.realpathSync(path.join(__dirname, '../../uploads'));

module.exports = function() {
    return async function(hook) {
        var imageId = undefined;

        if (hook.id) {
            imageId = hook.id;
        } else if (hook.data) {
            imageId = hook.data.image;
        }

        return new Promise(function(resolve, reject) {
            if (imageId && uploadsDir) {
                fs.stat(path.join(uploadsDir, imageId), function(err, stat) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                reject(new Error("Image id \"" + imageId + "\" not on the server"));
            }
        });
    };
};