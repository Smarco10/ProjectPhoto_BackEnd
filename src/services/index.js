const configuration = require('./configuration/configuration.service.js');
const photos = require('./photos/photos.service.js');
const users = require('./users/users.service.js');
const uploads = require('./uploads/uploads.service.js');
const albums = require('./albums/albums.service.js');

module.exports = function() {
    const app = this; // eslint-disable-line no-unused-vars
    app.configure(configuration);
    app.configure(photos);
    app.configure(users);
    app.configure(uploads);
    app.configure(albums);
};