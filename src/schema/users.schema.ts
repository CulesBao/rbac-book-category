import Joi from "joi";

export const usersSchema = Joi.object({
    email: Joi.string().email(),
    username: Joi.string().min(6).alphanum().trim(),
    password: Joi.string().min(6).trim(),
})