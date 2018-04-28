const logger = require('../../hooks/logger');
const imageResizer = require('../../middleware/imageResizer');
const pathConverter = require('./pathConverter.hooks');
const dauria = require('dauria');
const {
    authenticate
} = require('@feathersjs/authentication').hooks;
const permission = require('permission')

// before-create Hook to get the file (if there is any)
// and turn it into a datauri,
// transparently getting feathers-blob to work
// with multipart file uploads

module.exports = {
    before: {
        all: [logger(), pathConverter()],
        find: [],
        get: [
            async function(hook) {
                const params = hook.params.query;
                hook.result = await imageResizer(hook.id, params.size, params.format);
            }
        ],
        create: [
            authenticate('jwt'),
            permission(['admin']),
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
        update: [
            authenticate('jwt'),
            permission(['admin'])
        ],
        patch: [
            authenticate('jwt'),
            permission(['admin'])
        ],
        remove: [
            authenticate('jwt'),
            permission(['admin'])
        ]
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
