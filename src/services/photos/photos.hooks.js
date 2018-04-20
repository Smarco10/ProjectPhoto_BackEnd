const {
    authenticate
} = require('@feathersjs/authentication').hooks;
const logger = require('../../hooks/logger');
const fileExistancyChecker = require('../../hooks/fileExistancyChecker');
const fileDb = require('../../hooks/fileDb');

module.exports = {
    before: {
        all: [logger()],
        find: [],
        get: [fileDb(), fileExistancyChecker()],
        create: [authenticate('jwt'), fileExistancyChecker()],
        update: [authenticate('jwt'), fileExistancyChecker()],
        patch: [authenticate('jwt'), fileExistancyChecker()],
        remove: [authenticate('jwt')]
    },

    after: {
        all: [logger()],
        find: [],
        get: [fileDb(),
            function(hook) {
                console.log("after.get.result", hook.result);
            }
        ],
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