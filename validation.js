import joi from "joi"

export const addUserValidation = (data) => {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
      first_name: joi.string().min(3).required(),
      last_name: joi.string().min(3).required(),
      username: joi.string().min(5).required(),
      company_name: joi.string().min(5).required(),
      role: joi.string().min(4).required()
    });
    return schema.validate(data);
  };
  
export const addCompanyValidation = (data) => {
    const schema = joi.object({
        company_name: joi.string().min(3).required(),
        adress: joi.string().min(5).required(),
        number: joi.number().min(3).required(),
        zip: joi.number().min(5).required(),
        city: joi.string().min(3).required(),
        country: joi.string().min(3).required(),
        phone: joi.string().min(10).required(),
        email: joi.string().email().required()
    });
    return schema.validate(data)
}

 export const loginValidation = (data) => {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
    });
    return schema.validate(data);
  };
