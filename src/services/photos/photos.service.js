const hooks = require('./photos.hooks');

const fs = require("fs");

const gm = require('gm').subClass({
    imageMagick: true
});

const createModel = require('../../models/photos.model');

const default_format = "PNG";
const default_size = {
    x: 1000,
    y: 1000
};

class PhotosService {

    constructor(slideDb) {
        this.slideDb = slideDb;
    }

    getPhotoData(filePath, size, format) {

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

    setup(app, path) {}

    find(params) {
        let slideDb = this.slideDb;

        return new Promise(function(accept, refuse) {
            var query = params.query;
            if (!query) {
                query = {};
            }

            slideDb.find(query, function(err, docs) {
                if (err) {
                    refuse(err);
                } else {
                    accept(docs);
                }
            });
        });
    }

    get(id, param) {
        return this.getPhotoData(id, param.query.size, param.query.format);
    }

    create(data, params) {
        let slideDb = this.slideDb;
        return new Promise(function(resolve, reject) {
            slideDb.insert(data, function(err, insertedData) { // Callback is optional 
                if (err) {
                    reject(err);
                } else {
                    resolve(insertedData);
                }
            });
        });
    }

    update(id, data, params) {
        let slideDb = this.slideDb;
        return new Promise(function(resolve, reject) {
            slideDb.update({
                _id: id
            }, data, {
                upsert: false
            }, function(err, numAffected, affectedDocuments, upsert) {
                if (err) {
                    reject(err);
                } else {
                    resolve(insertedData._id);
                }
            });
        });
    }

    patch(id, data, params) {
        return this.update(id, data, params);
    }

    remove(id, params) {
        let slideDb = this.slideDb;
        return new Promise(function(resolve, reject) {
            slideDb.remove({
                _id: id
            }, {}, function(err, numRemoved) {
                if (!err && numRemoved > 0) {
                    resolve(id);
                } else {
                    reject(err);
                }
            });
        });
    }
}

module.exports = function() {
    const app = this;

    app.use('/photos', new PhotosService(createModel(app)));

    // Get our initialized service so that we can register hooks and channels
    app.service('photos').hooks(hooks);
};