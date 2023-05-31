import { searchSession } from "../repositories/post.repository.js";

export async function validateSession(req, res, next){
    const authorization = req.headers.authorization;
    if(authorization === undefined){
        return res.sendStatus(401);
    }
    const token = authorization.replace("Bearer ", "");
    try{
        const session = await searchSession(token);
        if(!session.rows[0]){
            return res.sendStatus(401)
        }
        next();
    } catch(e){
        console.log(e.message);
    }
}

export function validateContent(schema){
    return (req, res, next) => {
        const {link, description} = req.body;

        res.locals.link = link;
        res.locals.description = description;

        const validation = schema.validate(req.body);
        if(validation.error) {
            return res.status(422).send(validation.error.message);
        }
        next();
    }
}

export function validateUpdate(schema){
    return (req, res, next) => {
        const {postId, link, description} = req.body;

        res.locals.postId = postId;
        res.locals.link = link;
        res.locals.description = description;

        const validation = schema.validate(req.body);
        if(validation.error) {
            return res.status(422).send(validation.error.message);
        }
        next();
    }
}
