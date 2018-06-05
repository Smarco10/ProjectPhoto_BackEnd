const {
    authenticate
} = require('@feathersjs/authentication').hooks;
const errors = require('@feathersjs/errors');

const {
    restrictToRoles
} = require('feathers-authentication-hooks');

const Joi = require('joi'); //https://github.com/hapijs/joi/blob/v13.3.0/API.md

const logger = require('../../hooks/logger');
const fileExistancyChecker = require('../../hooks/fileExistancyChecker');
const getFileDb = require('../../middleware/fileDb');

const {
    DataValidatorShemas
} = require('../../commons');

function validateData(validators) {
    return function(hook) {
        if (!!validators[hook.method]) {
            Joi.validate(getItems(hook), shemas.generate(validators[hook.method].slide), shemas.options);
        } else {
            throw new errors.BadRequest('Invalid Parameters', {
                errors: 'Data received are not allowed here'
            });
        }
    };
}

module.exports = {
    before: {
        all: [logger()],
        find: [],
        get: [
            async function(hook) {
                hook.id = await getFileDb(hook.app).idToPath(hook.id);
            },
            fileExistancyChecker()
        ],
        create: [
            authenticate('jwt'),
            validateData(DataValidatorShemas),
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
            validateData(DataValidatorShemas),
            async function(hook) {
                hook.data.image = await getFileDb(hook.app).idToPath(hook.data.image);
            },
            fileExistancyChecker()
        ],
        patch: [
            authenticate('jwt'),
            validateData(DataValidatorShemas),
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