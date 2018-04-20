module.exports = function(app) {

    app.on('connection', connection => {
        app.channel('anonymous').join(connection);
    });

    //TODO: add authenticated channels

    app.publish((data, context) => {
        return app.channel('anonymous');
    });
};