const Joi = require('joi');
const {
    DataValidatorsTypes
} = require('../commons');

function generateShema(validator) {
    var shema = Joi.any().valid();

    if (!!validator) {
        switch (validator.type) {
            case DataValidatorsTypes.EMAIL:
                shema = Joi.string().trim().email();
                break;

            case DataValidatorsTypes.STRING:
                shema = Joi.string().regex(new RegExp(validator.pattern));

                if (validator.min) {
                    shema = shema.min(validator.min);
                }

                if (validator.max) {
                    shema = shema.max(validator.max);
                }
                break;

            case DataValidatorsTypes.SUBSET:
                shema = Joi.array().items(Joi.string().valid(validator.subsetOf));
                break;

            default:
                break;
        }

        if (validator.required) {
            shema = shema.required();
        }
    }

    return shema;
}

module.exports = {
    options: {
        abortEarly: false,
        convert: true,
        allowUnknown: false,
        stripUnknown: true
    },
    generate: function(validators) {
        var joiKeys = {};
        for (let key of Object.keys(validators)) {
            joiKeys[key] = generateShema(validators[key]);
        }
        return Joi.object().keys(joiKeys);
    }
};