// Initializes the `albums` service on path `/services/albums`
const createService = require('feathers-nedb');
const createModel = require('../../models/albums.model');
const hooks = require('./albums.hooks');

module.exports = function(app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/albums', createService(options));

    // Get our initialized service so that we can register hooks
    const service = app.service('albums');

    service.hooks(hooks);
};