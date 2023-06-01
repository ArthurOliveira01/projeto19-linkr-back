import Joi from "joi";

export const postsSchema = Joi.object({
    link: Joi.string().uri().required(),
    description: Joi.string(),
    postId: Joi.number()
})