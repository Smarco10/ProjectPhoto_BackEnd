const {
    HookMethods
} = require('../../commons');

module.exports = function() {
    return function(hook) {
        switch (hook.method) {
            case HookMethods.FIND:
                break;
            case HookMethods.GET:
                hook.data = {};
                break;
            case HookMethods.REMOVE:
                hook.data = {};
                break;
            case HookMethods.UPDATE:
                hook.data = {};
                break;
            case HookMethods.CREATE:
                hook.data = {
                    email: hook.data.email,
                    password: hook.data.password,
                    permissions: hook.data.permissions
                };
                break;
            case HookMethods.PATCH:
                hook.data = {
                    email: hook.data.email,
                    password: hook.data.password,
                    permissions: hook.data.permissions
                };
                break;
            default:
                break;
        }
    }
}