const Joi = require("joi");

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .optional(),
}).or("name", "email", "phone");

const validateCreateContact = async (schema, obj, next) => {
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

const validateUpdateContact = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: "missing fields",
    });
  }
};

module.exports = {
  validationCreateContact: (req, res, next) => {
    return validateCreateContact(schemaCreateContact, req.body, next);
  },
  validationUpdateContact: (req, res, next) => {
    return validateUpdateContact(schemaUpdateContact, req.body, next);
  },
};
