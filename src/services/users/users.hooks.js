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

const {
    getItems
} = require('feathers-hooks-common'); // used for validation of password and email: https://feathers-plus.github.io/v1/feathers-hooks-common/guide.html#Validate

const Joi = require('joi'); //https://github.com/hapijs/joi/blob/v13.3.0/API.md

const {
    SKIP
} = require('@feathersjs/feathers');
const errors = require('@feathersjs/errors');

const logger = require('../../hooks/logger');

//XXX const sanitizeData = require('./sanitizeData.hook');
const shemas = require('../../hooks/shemas');

const {
    HookMethods,
    UserPermissions,
    UserCreateDataValidators,
    UserPatchDataValidators,
    LoginDataValidators
} = require('../../commons');

const allowedRoles = [UserPermissions.ADMIN];

function validateData(validators) {
    return function(hook) {
        Joi.validate(getItems(hook), shemas.generate(validators), shemas.options);
    };
}

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
                    case HookMethods.PATCH:
                        if (!!hook.data) {
                            delete hook.data.permissions;
                        }
                        break;
                    case HookMethods.UPDATE:
                        throw new errors.Forbidden("Non admin users are not allowed to update themself");
                        break;
                    default:
                        break;
                }
            }
        });
    }

    return ...restrictHooks;
};

module.exports = {
    before: {
        all: [logger()],
        find: [restrict(false)],
        get: [
            //validateData(LoginDataValidators), //TODO: est-ce que c'est possible???
            restrict(true)
        ],
        create: [
            restrict(false),
            validateData(UserCreateDataValidators),
            hashPassword()
        ],
        update: [
            restrict(true),
            validateData(UserPatchDataValidators),
            hashPassword()
        ],
        patch: [
            restrict(true),
            validateData(UserPatchDataValidators),
            hashPassword()
        ],
        remove: [restrict(true)]
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