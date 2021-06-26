const Joi = require("joi");
const { HttpCodes } = require("../../../helpers/constants");

const schemaSignUp = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua"] },
    })
    .required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().optional(),
  avatarURL: Joi.string().optional(),
});

const schemaLogIn = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua"] },
    })
    .required(),
  password: Joi.string().min(6).required(),
});

const schemaResendVerification = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua"] },
    })
    .required(),
});

const validateResendVerification = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: HttpCodes.BAD_REQUEST,
      message: "missing required field email",
    });
  }
};

const validateUser = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: HttpCodes.BAD_REQUEST,
      message: "missing required fields",
    });
  }
};

module.exports = {
  validationSignUp: (req, res, next) => {
    return validateUser(schemaSignUp, req.body, next);
  },
  validationSignIn: (req, res, next) => {
    return validateUser(schemaLogIn, req.body, next);
  },
  validationReVerification: (req, res, next) => {
    return validateResendVerification(schemaResendVerification, req.body, next);
  },
};
