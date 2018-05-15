const hooks = require('./configuration.hooks');

const {
    UserPermissions
} = require('../../commons');

class ConfigurationService {

    constructor() {}

    setup(app, path) {}

    find(params) {
        //TODO all configurations allowed with their id
        return new Promise(resolve => {
            resolve({
                permissions: UserPermissions
            });
        });
    }

    get(id, param) {
        //TODO return config associated to the id if it is allowed to
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

    app.use('/configuration', new configurationService());

    // Get our initialized service so that we can register hooks and channels
    app.service('configuration').hooks(hooks);
};
