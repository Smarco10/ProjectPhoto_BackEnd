// A hook that check if a file exists or not on the server
const fs = require("fs");
const path = require("path");
const uploadsDir = fs.realpathSync(path.join(__dirname, '../../uploads'));
const getFileDb = require('../middleware/fileDb');

module.exports = function() {
    return async function(hook) {

        var fileDb = getFileDb(hook.app);

        switch (hook.type) {
            case 'before':
                switch (hook.method) {
                    case 'create':
                        await fileDb.checkMimeType(hook.data.uri);
                        break;
                    case 'update':
                    case 'patche':
                        await fileDb.checkMimeType(hook.data.uri);
                    case 'get':
                    case 'remove':
                        hook.id = await fileDb.idToPath(hook.id)
                        break;
                    default:
                        break;
                }
                break;
            case 'after':
                switch (hook.method) {
                    case 'create':
                        hook.result.id = await fileDb.createEntry(hook.result.id);
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
            case 'error':
                console.error(hook.method + ".errors: ", hook.errors);
                break;
            default:
                break;
        }
    };
};