// A hook that check if a file exists or not on the server
const {
    HookMethods,
    HookTypes
} = require('../../commons');
const getFileDb = require('../../middleware/fileDb');

module.exports = function() {
    return async function(hook) {

        var fileDb = getFileDb(hook.app);

        switch (hook.type) {
            case HookTypes.BEFORE:
                switch (hook.method) {
                    case HookMethods.CREATE:
                        if (hook.data && hook.data.uri) {
                            await fileDb.checkMimeType(hook.data.uri);
                        }
                        break;
                    case HookMethods.UPDATE:
                    case HookMethods.PATCH:
                        if (hook.data && hook.data.uri) {
                            await fileDb.checkMimeType(hook.data.uri);
                        }
                    case HookMethods.GET:
                    case HookMethods.REMOVE:
                        hook.id = await fileDb.idToPath(hook.id);
                        break;
                    default:
                        break;
                }
                break;
            case HookTypes.AFTER:
                switch (hook.method) {
                    case HookMethods.CREATE:
                        const filePath = require("path").join(hook.service.Model.path, hook.result.id);
                        hook.result.id = await fileDb.createEntry(filePath);
                        break;
                    case HookMethods.GET:
                    case HookMethods.UPDATE:
                    case HookMethods.PATCH:
                        hook.result.id = await fileDb.pathToId(hook.result.id);
                        break;
                    case HookMethods.REMOVE:
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