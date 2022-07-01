import Joi from "joi"

export const addUserValidation = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      first_name: Joi.string().min(3).required(),
      last_name: Joi.string().min(3).required(),
      username: Joi.string().min(5).required(),
      company_name: Joi.string().min(5).required(),
      role: Joi.string().min(4).required()
    });
    return schema.validate(data);
  };
  
export const addCompanyValidation = (data) => {
    const schema = joi.object({
        name: Joi.string().min(3).required(),
        adress: Joi.string().min(5).required(),
        number: Joi.number().min(3).required(),
        zip: Joi.number().min(5).required(),
        city: Joi.string().min(3).required(),
        country: Joi.string().min(3).required(),
        phone: Joi.string().min(10).required(),
        email: Joi.string().email().required()
    });
    return schema.validate(data)
}

 export const loginValidation = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
    return schema.validate(data);
  };
