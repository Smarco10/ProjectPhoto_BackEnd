// Initializes the `uploads` service on path `/uploads`
const hooks = require('./uploads.hooks');
const multer = require('multer');
const blobService = require('feathers-blob');

const multipartMiddleware = multer();

// Here we initialize a FileSystem storage,
// but you can use feathers-blob with any other
// storage service like AWS or Google Drive.
const fs = require("fs-blob-store");

// File storage location. Folder must be created before upload.
// Example: "./uploads" will be located under feathers app top level.
const blobStorage = fs("./uploads");

module.exports = function() {
    // Initialize our service with any options it requires
    this.use('/uploads',
        // multer parses the file named 'uri'.
        // Without extra params the data is
        // temporarely kept in memory
        multipartMiddleware.single('uri'),

        // another middleware, this time to
        // transfer the received file to feathers
        function(req, res, next) {
            req.feathers.file = req.file;
            next();
        },

        blobService({
            Model: blobStorage
        })
    );

    // Get our initialized service so that we can register hooks and channels
    this.service('uploads').hooks(hooks);
};