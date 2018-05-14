const {
    authenticate
} = require('@feathersjs/authentication').hooks;
const logger = require('../../hooks/logger');

const {
    restrictToRoles
} = require('feathers-authentication-hooks');

module.exports = {
    before: {
        all: [logger()],
        find: [],
        get: [],
        create: [
            authenticate('jwt')
        ],
        update: [
            authenticate('jwt')
        ],
        patch: [
            authenticate('jwt')
        ],
        remove: [
            authenticate('jwt')
        ]
    },

    after: {
        all: [logger()],
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
