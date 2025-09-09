import { generalValidations } from "@utils/general.valiations";
import joi from "joi";

const signUpValidation = joi
  .object({
    firstName: generalValidations.firstName.required(),
    lastName: generalValidations.lastName.required(),
    email: generalValidations.email.required(),
    password: generalValidations.password.required(),
    age: generalValidations.age,
    phone: generalValidations.phone,
    role: generalValidations.role,
  })


const loginValidation = joi
  .object({
    email: generalValidations.email.required(),
    password: generalValidations.password.required(),
  })
  .required();

export { signUpValidation, loginValidation };
