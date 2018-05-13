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

const UserPermissions = Object.freeze({
    ADMIN: "admin",
    USER: "user"
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
    subsetOf: Object.values(UserPermissions)
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
    UserPermissions,
    DataValidatorsTypes,
    UserCreateDataValidators,
    UserPatchDataValidators
};