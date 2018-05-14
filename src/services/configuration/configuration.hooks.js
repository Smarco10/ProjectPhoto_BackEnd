const {
    authenticate
} = require('@feathersjs/authentication').hooks;

const {
    PermissionsTypes
} = require('../../commons');
const restrictToPermissions = require('../../hooks/restrictToPermissions');

const logger = require('../../hooks/logger');

restrict = [
    authenticate('jwt'),
    restrictToPermissions(PermissionsTypes.ADMIN, false) //owner not allowed
];

module.exports = {
    before: {
        all: [logger()],
        find: [], //used by restrictToPermissions
        get: [],
        create: [
            //...restrict //TODO: restore when first permissions will be added
        ],
        update: [
            ...restrict
        ],
        patch: [
            ...restrict
        ],
        remove: [
            ...restrict
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