// Initializes the `users` service on path `/users`
const createService = require('feathers-nedb');
const createModel = require('../../models/configuration.model');
const hooks = require('./configuration.hooks');

module.exports = function() {
    const app = this;
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'configuration',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/configuration', createService(options));

    // Get our initialized service so that we can register hooks and channels
    app.service('configuration').hooks(hooks);
};