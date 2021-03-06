const {
    authenticate
} = require('@feathersjs/authentication').hooks;
const errors = require('@feathersjs/errors');

const {
    restrictToRoles
} = require('feathers-authentication-hooks');
const {
    getItems
} = require('feathers-hooks-common');

const Joi = require('joi'); //https://github.com/hapijs/joi/blob/v13.3.0/API.md

const logger = require('../../hooks/logger');
const shemas = require('../../hooks/shemas');

const {
    UserPermissions,
    DataValidatorShemas
} = require('../../commons');

function validateData(validators) {
    return function(hook) {
        if (!!validators[hook.method]) {
            Joi.validate(getItems(hook), shemas.generate(validators[hook.method].album), shemas.options);
        } else {
            throw new errors.BadRequest('Invalid Parameters', {
                errors: 'Data received are not allowed here'
            });
        }
    };
}

const allowedRoles = [UserPermissions.ADMIN];

let restrictHooks = [
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
            ...restrictHooks,
            validateData(DataValidatorShemas)
        ],
        update: [
            ...restrictHooks,
            validateData(DataValidatorShemas)
        ],
        patch: [
            ...restrictHooks,
            validateData(DataValidatorShemas)
        ],
        remove: [...restrictHooks]
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