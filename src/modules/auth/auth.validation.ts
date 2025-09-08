import { UserRoles } from "@utils/enums";
import joi from "joi";

const signUpValidation = joi
  .object({
    firstName: joi.string().min(3).max(50).required().messages({
      "string.min": "Name must be at least 3 characters long",
      "string.max": "the {VALUE} must be at most 50 characters long",
      "any.required": "firstName is required",
    }),
    lastName: joi.string().required().messages({
      "string.min": "Name must be at least 3 characters long",
      "string.max": "the {VALUE} must be at most 50 characters long",
      "any.required": "lastName is required",
    }),
    email: joi.string().email().required().messages({
      "string.email": "email is required",
      "any.required": "email is required",
    }),
    password: joi.string().required().messages({
      "any.required": "password is required",
    }),
    age: joi.number().required().messages({
      "any.required": "age is required",
    }),
    phone: joi.string().messages({
      "any.required": "phone must be a string",
    }),
    role: joi
      .string()
      .valid(...Object.values(UserRoles).filter((v) => typeof v === "string"))
      .required()
      .messages({
        "any.required": "role is required",
        "any.allowOnly": "role is not supported",
      })
      .default(UserRoles.USER),
  })


const loginValidation = joi
  .object({
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 3,
        tlds: { allow: ["com", "net", "org", "gmail"] },
      })
      .required()
      .messages({
        "string.email": "email is required",
        "any.required": "email is required",
      }),
    password: joi.string().required().messages({
      "any.required": "password is required",
    }),
  })
  .required();

export { signUpValidation, loginValidation };
