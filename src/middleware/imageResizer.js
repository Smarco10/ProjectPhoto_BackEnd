// A hook that check if a file exists or not on the server
const fs = require("fs");

const gm = require('gm').subClass({
    imageMagick: true
});

const default_format = "PNG";
const default_size = {
    x: 1000,
    y: 1000
};

module.exports = function(filePath, size, format) {

    if (!size) {
        size = default_size;
    }
    if (!format) {
        format = default_format;
    }

    return new Promise(function(resolve, reject) {
        //use imagemagick resize: https://github.com/aheckmann/gm
        gm(fs.realpathSync(filePath))
            .resize(size.width, size.height)
            .toBuffer(format, function(err, buffer) {
                if (!err) {
                    // Override the original data (so that people can't submit additional stuff)
                    gm(buffer, "buffer." + format)
                        .identify(function(err, metadata) {
                            if (!err) {
                                resolve({
                                    id: filePath,
                                    buffer: buffer,
                                    metadata: metadata
                                });
                            } else {
                                reject(err);
                            }
                        });
                } else {
                    reject(err);
                }
            });
    });
}