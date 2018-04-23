const createUploadDb = require('../models/uploads.model')

class FileDb {

    constructor(app) {
        this.fileDb = createUploadDb(app);
    }

    createEntry(path) {
        const id = path;
        let thus = this;
        return new Promise(function(resolve, reject) {
            const pathToCreate = {
                path: path
            };
            thus.fileDb.find(pathToCreate, function(err, docs) {
                if (err) {
                    refuse(err);
                } else if (docs.length === 0) {
                    thus.fileDb.insert(pathToCreate, function(err, insertedData) {
                        if (err) {
                            reject(err);
                        } else {
                            thus.printDb();
                            resolve(insertedData._id);
                        }
                    });
                } else if (docs.length === 1) {
                    resolve(docs[0]._id);
                } else {
                    throw new Error("Too many entries for this path"); //TODO: Or return first object???
                }
            });
        });
    }

    idToPath(id) {
        let fileDb = this.fileDb;
        return new Promise((accept, refuse) => {
            fileDb.findOne({
                _id: id
            }, function(err, doc) {
                if (err) {
                    refuse(err);
                } else {
                    accept(doc.path);
                }
            });
        });
    }

    pathToId(path) {
        let fileDb = this.fileDb;
        return new Promise((accept, refuse) => {
            fileDb.find({
                path: path
            }, function(err, docs) {
                if (err) {
                    refuse(err);
                } else if (docs.length === 0) {
                    accept(undefined);
                } else if (docs.length === 1) {
                    accept(docs[0].path);
                } else {
                    refuse(new Error("Too many files for this path"));
                }
            });
        });
    }

    removeEntry(id) {
        let thus = this;
        return new Promise(function(resolve, reject) {
            thus.fileDb.remove({
                _id: id
            }, function(err, insertedData) {
                if (err) {
                    reject(err);
                } else {
                    thus.printDb();
                    resolve(insertedData._id);
                }
            });
        });
    }

    printDb() {
        this.fileDb.find({}, (err, docs) => {
            console.log("printDb:");
            if (err)
                console.error(err);
            else
                console.log(docs);
        })
    }

    checkMimeType(uri) {
        var mimetypeFound = (uri.search("[a-zA-Z]+:[a-zA-Z]+\\/[a-zA-Z]+;") != -1);
        if (mimetypeFound) {
            var mimetype = uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")); //data:image/png;base64
            var mimetypeIsAllowed = false;
            if (mimetype) {
                switch (mimetype.toLowerCase()) {
                    case "image/png":
                    case "image/jpeg":
                    case "image/jpg":
                        mimetypeIsAllowed = true;
                        break;
                    default:
                        break;
                }
            }

            if (mimetypeIsAllowed === false) {
                throw new Error("mimetype '" + mimetype + "' is not allowed");
            }
        } else {
            throw new Error("mimetype not found");
        }
    }
}

var Singleton = (function() {
    var instance;

    function createInstance(app) {
        var object = new FileDb(app);
        return object;
    }

    return {
        getInstance: function(app) {
            if (!instance) {
                instance = createInstance(app);
            }
            return instance;
        }
    };
})();

module.exports = function(app) {
    return Singleton.getInstance(app);
};