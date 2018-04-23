// A hook that check if a file exists or not on the server
const getFileDb = require('../../middleware/fileDb');

module.exports = function() {
    return async function(hook) {

        var fileDb = getFileDb(hook.app);

        switch (hook.type) {
            case 'before':
                switch (hook.method) {
                    case 'create':
                        if (hook.data && hook.data.uri) {
                            await fileDb.checkMimeType(hook.data.uri);
                        }
                        break;
                    case 'update':
                    case 'patche':
                        if (hook.data && hook.data.uri) {
                            await fileDb.checkMimeType(hook.data.uri);
                        }
                    case 'get':
                    case 'remove':
                        hook.id = await fileDb.idToPath(hook.id);
                        break;
                    default:
                        break;
                }
                break;
            case 'after':
                switch (hook.method) {
                    case 'create':
                        const filePath = require("path").join(hook.service.Model.path, hook.result.id);
                        hook.result.id = await fileDb.createEntry(filePath);
                        break;
                    case 'get':
                    case 'update':
                    case 'patche':
                        hook.result.id = await fileDb.pathToId(hook.result.id);
                        break;
                    case 'remove':
                        hook.result.id = await fileDb.pathToId(hook.result.id);
                        await fileDb.removeEntry(hook.result.id);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    };
};