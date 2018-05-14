const HookTypes = Object.freeze({
    BEFORE: "before",
    AFTER: "after",
    ERROR: "error"
});

const HookMethods = Object.freeze({
    ALL: "all",
    FIND: "find",
    GET: "get",
    CREATE: "create",
    UPDATE: "update",
    PATCH: 'patch',
    REMOVE: 'remove'
});

const ConfigurationTypes = Object.freeze({
    PERMISSIONS: "permissions"
});

const PermissionsTypes = Object.freeze({
    ALL: "all",
    ADMIN: "admin"
});

const DataValidatorsTypes = Object.freeze({
    EMAIL: "email",
    STRING: "string",
    SUBSET: "subset"
});

const EmailValidator = Object.freeze({
    required: true,
    type: DataValidatorsTypes.EMAIL
});

const PasswordValidator = Object.freeze({
    type: DataValidatorsTypes.STRING,
    pattern: /^[\sa-zA-Z0-9]$/,
    min: 5
});

const PermissionsValidator = Object.freeze({
    type: DataValidatorsTypes.SUBSET,
    subsetOf: [] //TODO: replace by checking in the database Object.values(UserPermissions)
});

const UserCreateDataValidators = Object.freeze({
    email: EmailValidator,
    password: Object.assign({}, PasswordValidator, {
        required: true
    }),
    permissions: PermissionsValidator
});

const UserPatchDataValidators = Object.freeze({
    email: EmailValidator,
    password: PasswordValidator,
    permissions: PermissionsValidator
});

module.exports = {
    HookTypes,
    HookMethods,
    ConfigurationTypes,
    PermissionsTypes,
    DataValidatorsTypes,
    UserCreateDataValidators,
    UserPatchDataValidators
};