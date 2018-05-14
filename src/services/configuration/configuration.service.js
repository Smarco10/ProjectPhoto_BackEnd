const hooks = require('./configuration.hooks');

class ConfigurationService {

    constructor() {}

    setup(app, path) {}

    find(params) {}

    get(id, param) {
    }

    create(data, params) {
    }

    update(id, data, params) {

    patch(id, data, params) {
    }

    remove(id, params) {
    }
}

module.exports = function() {
    const app = this;

    app.use('/configuration', new configurationService());

    // Get our initialized service so that we can register hooks and channels
    app.service('configuration').hooks(hooks);
};
