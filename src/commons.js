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
    ARRAY: "array"
});

const BdIdValidatorShema = Object.freeze({
    type: DataValidatorShemasTypes.STRING,
    pattern: "^[a-zA-Z0-9]{16}$",
    min: 16,
    max: 16
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
    type: DataValidatorShemasTypes.ARRAY,
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

const SlideCreateDataValidatorShemas = Object.freeze({
    title: {
        required: true,
        type: DataValidatorShemasTypes.STRING,
        min: 1
    },
    image: Object.assign({}, BdIdValidatorShema, {
        required: true
    }),
    text: {
        type: DataValidatorShemasTypes.STRING
    }
});

const SlidePatchDataValidatorShemas = Object.freeze({
    title: {
        type: DataValidatorShemasTypes.STRING,
        min: 1
    },
    image: BdIdValidatorShema,
    text: {
        type: DataValidatorShemasTypes.STRING
    }
});

const AlbumCreateDataValidatorShemas = Object.freeze({
    title: {
        required: true,
        type: DataValidatorShemasTypes.STRING,
        min: 1
    },
    image: Object.assign({}, BdIdValidatorShema, {
        required: true
    }),
    slides: {
        required: true,
        type: DataValidatorShemasTypes.ARRAY,
        eltShema: BdIdValidatorShema
    }
});

const AlbumPatchDataValidatorShemas = Object.freeze({
    title: {
        type: DataValidatorShemasTypes.STRING,
        min: 1
    },
    image: BdIdValidatorShema,
    slides: {
        type: DataValidatorShemasTypes.ARRAY,
        eltShema: BdIdValidatorShema
    }
});

var DataValidatorShemas = {};

DataValidatorShemas[HookMethods.CREATE] = {
    user: UserCreateDataValidatorShemas,
    slide: SlideCreateDataValidatorShemas,
    album: AlbumCreateDataValidatorShemas
};
DataValidatorShemas[HookMethods.PATCH] = {
    user: UserPatchDataValidatorShemas,
    slide: SlidePatchDataValidatorShemas,
    album: AlbumPatchDataValidatorShemas
};
DataValidatorShemas[HookMethods.UPDATE] = {
    user: UserPatchDataValidatorShemas,
    slide: SlidePatchDataValidatorShemas,
    album: AlbumPatchDataValidatorShemas
};
DataValidatorShemas[HookMethods.GET] = {
    user: LoginDataValidatorShemas
}

module.exports = {
    HookTypes,
    HookMethods,
    UserPermissions,
    DataValidatorShemas
};