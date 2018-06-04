const {
    authenticate
} = require('@feathersjs/authentication').hooks;
const logger = require('../../hooks/logger');
const fileExistancyChecker = require('../../hooks/fileExistancyChecker');
const getFileDb = require('../../middleware/fileDb');

const {
    restrictToRoles
} = require('feathers-authentication-hooks');

module.exports = {
    before: {
        all: [logger()],
        find: [function(hook) {
            console.log("photo.find.hook", hook);
        }],
        get: [
            async function(hook) {
                hook.id = await getFileDb(hook.app).idToPath(hook.id);
            },
            fileExistancyChecker()
        ],
        create: [
            authenticate('jwt'),
            async function(hook) {
                hook.data.image = await getFileDb(hook.app).idToPath(hook.data.image);
            },
            fileExistancyChecker(),
            async function(hook) {
                hook.data.image = await getFileDb(hook.app).pathToId(hook.data.image);
            },
        ],
        update: [
            authenticate('jwt'),
            async function(hook) {
                hook.data.image = await getFileDb(hook.app).idToPath(hook.data.image);
            },
            fileExistancyChecker()
        ],
        patch: [
            authenticate('jwt'),
            async function(hook) {
                hook.data.image = await getFileDb(hook.app).idToPath(hook.data.image);
            },
            fileExistancyChecker()
        ],
        remove: [
            authenticate('jwt')
        ]
    },

    after: {
        all: [logger()],
        find: [],
        get: [
            async function(hook) {
                hook.result.id = await getFileDb(hook.app).pathToId(hook.result.id);
            }
        ],
        create: [],
        update: [
            async function(hook) {
                hook.result.image = await getFileDb(hook.app).pathToId(hook.result.image);
            }
        ],
        patch: [
            async function(hook) {
                hook.result.image = await getFileDb(hook.app).pathToId(hook.result.image);
            }
        ],
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