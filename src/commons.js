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

const DataValidatorShemasTypes = Object.freeze({
    EMAIL: "email",
    STRING: "string",
    SUBSET: "subset"
});

const EmailValidatorShema = Object.freeze({
    required: true,
    type: DataValidatorShemasTypes.EMAIL
});

const PasswordValidatorShema = Object.freeze({
    type: DataValidatorShemasTypes.STRING,
    pattern: "^.*$",
    min: 5
});

const PermissionsValidatorShema = Object.freeze({
    type: DataValidatorShemasTypes.SUBSET,
    subsetOf: Object.values(UserPermissions)
});

const UserCreateDataValidatorShemas = Object.freeze({
    email: EmailValidatorShema,
    password: Object.assign({}, PasswordValidatorShema, {
        required: true
    }),
    permissions: PermissionsValidatorShema
});

const UserPatchDataValidatorShemas = Object.freeze({
    email: EmailValidatorShema,
    password: PasswordValidatorShema,
    permissions: PermissionsValidatorShema
});

const LoginDataValidatorShemas = Object.freeze({
    email: EmailValidatorShema,
    password: Object.assign({}, PasswordValidatorShema, {
        required: true
    })
});

module.exports = {
    HookTypes,
    HookMethods,
    UserPermissions,
    DataValidatorShemasTypes,
    UserCreateDataValidatorShemas,
    UserPatchDataValidatorShemas,
    LoginDataValidatorShemas
};