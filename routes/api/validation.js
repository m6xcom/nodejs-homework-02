const Joi = require("joi");
const mongoose = require("mongoose");

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().required(),
  favorite: Joi.bool().optional(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  phone: Joi.string().optional(),
}).or("name", "email", "phone");

const schemaUpdateFavorite = Joi.object({
  favorite: Joi.bool().required(),
});

const validateContact = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: "missing required field",
    });
  }
};

module.exports = {
  validationCreateContact: (req, res, next) => {
    return validateContact(schemaCreateContact, req.body, next);
  },
  validationUpdateContact: (req, res, next) => {
    return validateContact(schemaUpdateContact, req.body, next);
  },
  validationUpdateFavorite: (req, res, next) => {
    return validateContact(schemaUpdateFavorite, req.body, next);
  },
  validationId: (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
      return next({
        status: 400,
        message: "Invalid ObjectId",
      });
    }
    next();
  },
};
