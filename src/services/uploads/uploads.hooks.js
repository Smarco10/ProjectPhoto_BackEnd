const logger = require('../../hooks/logger');
const fileDb = require('../../hooks/fileDb');
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
        all: [logger(), fileDb()],
        find: [],
        get: [],
        create: [authenticate('jwt'),
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
        update: [authenticate('jwt')],
        patch: [authenticate('jwt')],
        remove: [authenticate('jwt')]
    },

    after: {
        all: [logger(), fileDb()],
        find: [],
        get: [],
        create: [
            function(hook) {
                const filePath = hook.service.Model.path + '/' + hook.result;
                console.log(filePath);
            }
        ],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [logger(), fileDb()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};