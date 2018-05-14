const {
    ConfigurationTypes
} = require('../commons');

const {
    restrictToRoles
} = require('feathers-authentication-hooks');

module.exports = function(permissionsType, ownerAllowed) {
    return async function(hook) {
        const permissionsObject = await hook.app.service('configuration').find({
            query: {
                type: ConfigurationTypes.PERMISSIONS
            }
        });

        return restrictToRoles({
            roles: permissionsObject[permissionsType],
            fieldName: 'permissions', //The field on your user object that denotes their role or roles
            idField: '_id', //The id field on your user object
            ownerField: '_id', //The id field for a user on your resource
            owner: ownerAllowed // Denotes whether it should also allow owners regardless of their role (ie. the user has the role or is an owner)
        })(hook);
    }
}