const hooks = require('./configuration.hooks');

const {
    UserPermissions,
    UserCreateDataValidators,
    UserPatchDataValidators
} = require('../../commons');


const conf = {
    permissions: UserPermissions,
    validators: {
        userCreateData: UserCreateDataValidators,
        uerPatchData: UserPatchDataValidators
    }
};

class ConfigurationService {

    constructor() {}

    setup(app, path) {}

    find(params) {
        return new Promise(resolve => {
            resolve(conf);
        });
    }

    get(id, param) {
        return new Promise(resolve => {
            resolve(conf[id]);
        });
    }

    create(data, params) {
        //TODO create a new config: only for allowed
    }

    update(id, data, params) {
        //TODO update config if allowed
    }

    patch(id, data, params) {
        //TODO patch config if allowed
    }

    remove(id, params) {
        //TODO remove config if allowed
    }
}

module.exports = function() {
    const app = this;

    app.use('/configuration', new ConfigurationService());

    // Get our initialized service so that we can register hooks and channels
    app.service('configuration').hooks(hooks);
};