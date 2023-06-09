import { insertPost, getPostsByFollowing, searchSession, searchPost, deletePost, updatePost, searchPosts, likePostDB, dislikePost, searchLikes, searchUserLike, getComments, postComments, getFollowing } from "../repositories/post.repository.js";
import { searchUser } from "../repositories/authorization.repository.js";
import urlMetadata from "url-metadata";



export async function postContent(req, res){
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer ", "");
    const { link, description } = res.locals;
    let able = true;
    
    try {
        const session = await searchSession(token);
        const userId = session.rows[0].idUser;
        const currentTimestamp = Date.now();
        const postgresTimestamp = new Date(currentTimestamp).toISOString();
        await urlMetadata(link)
        .then((metadata) => {
        }, (err) =>{
            able = false
            return res.status(422).send('Link inválido para os metadados');
        })  
        if(able){
            await insertPost(userId, link, description, postgresTimestamp);
            return res.sendStatus(200);
        }
    } catch (error) {
        console.log(error.message);
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

export async function getPosts(req, res){
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer ", "");

    try {
        const session = await searchSession(token);
        const idUser = session.rows[0].idUser;
        const follows = await getFollowing(idUser);
        let followsId = [];
        for(let i = 0; i < follows.rows.length; i++){
            followsId.push(follows.rows[i].followsId);
        }
        followsId.push(idUser);
        const posts = await getPostsByFollowing(followsId);
        const info = posts.rows;
        let final = [];
        for(let i = 0; i < info.length; i++){
            const user = await searchUser(info[i].idUser);
            const userinfo = user.rows[0];
            let meta;
            await urlMetadata(info[i].link)
            .then((metadata) => {
                meta = metadata;
            }, (err) =>{
            }) 
            const likes = await searchLikes(info[i].id);
            const likeCount = likes.rows.length;
            const done = await searchUserLike(idUser, info[i].id);
            let liked;
            if(!done.rows[0]){
                liked = false;
            } else {
                liked = true;
            }
            const comments = await getComments(info[i].id);
            const quantity = comments.rowCount;
            const aux = {
                id: info[i].id,
                idUser: info[i].idUser,
                link: info[i].link,
                description: info[i].description,
                createdAt: info[i].createdAt,
                username: userinfo.name,
                foto: userinfo.foto,
                likes: likeCount,
                liked: liked,
                comment: quantity,
                metaTitle: meta.title,
                metaDescription: meta.description,
                metaImg: meta.image
            }
            final.push(aux);
        }
        return res.status(200).send(final);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function likePost(req, res){
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer ", "");
    const { idPost } = req.body;

    try {
        const session = await searchSession(token);
        const idUser = session.rows[0].idUser;
        await likePostDB(idUser, idPost);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function unlikePost(req, res){
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer ", "");
    const { idPost } = req.params;

    try {
        const session = await searchSession(token);
        const idUser = session.rows[0].idUser;
        await dislikePost(idUser, idPost);
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function postComment(req, res){
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer ", "");
    const { idPost, comment } = res.locals;

    try {
        const session = await searchSession(token);
        const userId = session.rows[0].idUser;
        const post = await searchPost(idPost);
        if(!post.rows[0]){
            return res.sendStatus(404);
        };
        await postComments(userId, idPost, comment);
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function getComment(req, res){
    const { idPost } = req.params;
    const authorization = req.headers.authorization;
    const token = authorization.replace("Bearer ", "");
    try {
        const session = await searchSession(token);
        const userId = session.rows[0].idUser;
        const post = await searchPost(idPost);
        if(!post.rows[0]){
            return res.sendStatus(404);
        };
        const comments = await getComments(idPost);
        if(comments.rows.length === 0){
            return res.status(200).send([{}]);
        }
        let final = [];
        for(let i = 0; i < comments.rows.length; i++){
            let owner = false;
            const user = await searchUser(comments.rows[i].idUser);
            const userinfo = user.rows[0];
            if(userinfo.id === post.rows[0].idUser){
                owner = true;
            }
            const obj = {
                username: userinfo.name,
                userId: userinfo.id,
                foto: userinfo.foto,
                comment: comments.rows[i].comment,
                owner: owner
            }
            final.push(obj);
        }
        return res.status(200).send(final);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}