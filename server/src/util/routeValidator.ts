// validation package import
const Joi = require("@hapi/joi");

const validationObject = {
  validateBody: (schema: any) => {
    return (req: any, res: any, next: any) => {
      const valid = Joi.validate(req.body, schema);

      if (valid.error) {
        return res.status(400).json(valid.error);
      } else {
        if (!req.value) {
          req.value = {};
        }

        if (!req.value["body"]) {
          req.value["body"] = {};
        }
        req.value["body"] = valid.value;
        next();
      }
    };
  },
  schemas: {
    customerSchema: Joi.object().keys({
      customerID: Joi.number().required(),
      gender: Joi.string().required(),
      birthday: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      customerLifetimeValue: Joi.string().required(),
      lastContact: Joi.date().required()
    })
  }
};
export default validationObject;
