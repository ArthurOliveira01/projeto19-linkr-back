import { insertPost, searchSession, searchPost, deletePost, updatePost } from "../repositories/post.repository.js";


export async function postContent(req, res){
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer ", "");
    const { link, description } = res.locals;
    
    try {
        const session = await searchSession(token);
        const userId = session.rows[0].idUser;
        const currentTimestamp = Date.now();
        const postgresTimestamp = new Date(currentTimestamp).toISOString();
        await insertPost(userId, link, description, postgresTimestamp);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function deleteContent(req, res){
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer ", "");
    const { postId } = req.body;

    try {
        const session = await searchSession(token);
        const userId = session.rows[0].idUser;
        const post = await searchPost(postId);
        if(!post.rows[0]){
            return res.sendStatus(404);
        };
        const authorId = post.rows[0].idUser;
        if(authorId !== userId){
            return res.sendStatus(401);
        }
        deletePost(postId);
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function updateContent(req, res){
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer ", "");
    const { postId, link, description } = res.locals;

    try {
        const session = await searchSession(token);
        const userId = session.rows[0].idUser;
        const post = await searchPost(postId);
        if(!post.rows[0]){
            return res.sendStatus(404);
        };
        const authorId = post.rows[0].idUser;
        if(authorId !== userId){
            return res.sendStatus(401);
        }
        updatePost(link, description, postId);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}