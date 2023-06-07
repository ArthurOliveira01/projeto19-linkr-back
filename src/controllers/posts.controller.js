import { insertPost, searchSession, searchPost, deletePost, updatePost, searchPosts } from "../repositories/post.repository.js";
import { searchUser } from "../repositories/authorization.repository.js";


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
    const { postId } = req.params;

    try {
        const session = await searchSession(token);
        const userId = session.rows[0].idUser;
        console.log(postId);
        const post = await searchPost(postId);
        console.log(post.rows);
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

export async function getPosts(req, res){
    try {
        const posts = await searchPosts();
        const info = posts.rows;
        let final = [];
        for(let i = 0; i < info.length; i++){
            const user = await searchUser(info[i].idUser);
            const userinfo = user.rows[0];
            const aux = {
                id: info[i].id,
                idUser: info[i].idUser,
                link: info[i].link,
                description: info[i].description,
                createdAt: info[i].createdAt,
                username: userinfo.name,
                foto: userinfo.foto,
            }
            final.push(aux);       
        }
        return res.status(200).send(final);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}