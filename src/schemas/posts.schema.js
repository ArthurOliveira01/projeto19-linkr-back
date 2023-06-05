import Joi from "joi";

export const postsSchema = Joi.object({
    link: Joi.string().uri().required(),
    description: Joi.string().allow(''),
    postId: Joi.number()
})