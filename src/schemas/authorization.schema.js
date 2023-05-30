import joi from "joi"

export const userSchema = joi.object({
    name: joi.string().min(1).required(),
    email: joi.string().email().required(),
    password: joi.string().min(1).required(),
    foto:  joi.string().uri().required()
})