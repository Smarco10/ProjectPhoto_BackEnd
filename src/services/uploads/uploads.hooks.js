const logger = require('../../hooks/logger');
const pathConverter = require('./pathConverter.hooks');
const dauria = require('dauria');
const {
    authenticate
} = require('@feathersjs/authentication').hooks;

// before-create Hook to get the file (if there is any)
// and turn it into a datauri,
// transparently getting feathers-blob to work
// with multipart file uploads

module.exports = {
    before: {
        all: [authenticate('jwt'), logger(), pathConverter()],
        find: [],
        get: [],
        create: [
            function(hook) {
                if (!hook.data.uri && hook.params.file) {
                    const file = hook.params.file;
                    const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
                    hook.data = {
                        uri: uri
                    };
                }
            }
        ],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [logger(), pathConverter()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [logger()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};