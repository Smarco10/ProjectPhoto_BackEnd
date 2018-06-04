const hooks = require('./photos.hooks');
const createModel = require('../../models/photos.model');

class PhotosService {

    constructor(slideDb) {
        this.slideDb = slideDb;
    }

    setup(app, path) {}

    find(params) {
        //TODO: pk param.query is empty???
        console.log("photo.find", params);
        let slideDb = this.slideDb;
        return new Promise(function(accept, refuse) {
            var query = params.query;

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
        let slideDb = this.slideDb;
        return new Promise(function(accept, refuse) {
            slideDb.find({
                _id: id
            }, function(err, doc) {
                if (err) {
                    refuse(err);
                } else {
                    accept(doc);
                }
            });
        });
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