const {
    authenticate
} = require('@feathersjs/authentication').hooks;
const logger = require('../../hooks/logger');

const {
    restrictToRoles
} = require('feathers-authentication-hooks');

const {
    UserPermissions
} = require('../../commons');

const allowedRoles = [UserPermissions.ADMIN];

function restrict = [
    authenticate('jwt'),
    restrictToRoles({
        roles: allowedRoles,
        fieldName: 'permissions', //The field on your user object that denotes their role or roles
        idField: '_id', //The id field on your user object
        ownerField: '_id', //The id field for a user on your resource
        owner: false // Denotes whether it should also allow owners regardless of their role (ie. the user has the role or is an owner)
    })
];


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
