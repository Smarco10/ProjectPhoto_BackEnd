const {
    authenticate
} = require('@feathersjs/authentication').hooks;

const {
    hashPassword,
    protect
} = require('@feathersjs/authentication-local').hooks;

const {
    restrictToRoles
} = require('feathers-authentication-hooks');

const commonHooks = require('feathers-hooks-common'); //TODO: to use for validation of password and email: https://feathers-plus.github.io/v1/feathers-hooks-common/guide.html#Validate

const {
    SKIP
} = require('@feathersjs/feathers');
const errors = require('@feathersjs/errors');

const logger = require('../../hooks/logger');

const allowedRoles = ['admin'];

function restrict(ownerAllowed) {
    let restrictHooks = [
        authenticate('jwt'),
        restrictToRoles({
            roles: allowedRoles,
            fieldName: 'permissions', //The field on your user object that denotes their role or roles
            idField: '_id', //The id field on your user object
            ownerField: '_id', //The id field for a user on your resource
            owner: ownerAllowed // Denotes whether it should also allow owners regardless of their role (ie. the user has the role or is an owner)
        })
    ];

    if (ownerAllowed) {
        restrictHooks.push(function(hook) {
            var hasAllowedRole = false;
            if (!!hook.params && !!hook.params.user && !!hook.params.user.permissions) {
                for (var i = 0; i < allowedRoles.length; ++i) {
                    if (hook.params.user.permissions.indexOf(allowedRoles[i]) >= 0) {
                        hasAllowedRole = true;
                        break;
                    }
                }
            }
            if (!hasAllowedRole) {
                //User is a non-admin owner
                switch (hook.method) {
                    case "patch":
                        if (!!hook.data) {
                            delete hook.data.permissions;
                        }
                        break;
                    case "update":
                        throw new errors.Forbidden("Non admin users are not allowed to update themself");
                        break;
                    default:
                        break;
                }
            }
        });
    }

    return restrictHooks;
};

function checkPassword(passwordFieldName, needToBePresent) {
    return function(hook) {
        if (hook.data[passwordFieldName] === undefined || hook.data[passwordFieldName].trim() === "") {
            if (needToBePresent) {
                throw new errors.BadRequest('Password is not valid');
            } else {
                return SKIP;
            }
        }
    }
}

module.exports = {
    before: {
        all: [logger()],
        find: [...restrict(false)],
        get: [...restrict(true)],
        create: [...restrict(false), checkPassword('password', true), hashPassword()],
        update: [...restrict(true), checkPassword('password', false), hashPassword()],
        patch: [...restrict(true), checkPassword('password', false), hashPassword()],
        remove: [...restrict(true)]
    },

    after: {
        all: [
            // Make sure the password field is never sent to the client
            // Always must be the last hook
            protect('password')
        ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};