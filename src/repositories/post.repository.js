import { db } from "../database/databaseconnectio.js";

export function searchSession(token){
    return db.query(`SELECT * FROM login WHERE token=$1`, [token]);
}

export function insertPost(idUser, link, description, createdAt){
    return db.query(`INSERT INTO posts ("idUser", link, description, createdAt) VALUES ($1, $2, $3, $4)`, [idUser, link, description, createdAt]);
}

export function searchPost(postId){
    return db.query(`SELECT * FROM posts WHERE id=$1`, [postId]);
}

export function deletePost(postId){
    return db.query(`DELETE FROM posts WHERE id=$1`, [postId])
}

export function updatePost(link, description, postId){
    return db.query(`UPDATE posts SET link=$1, description=$2  WHERE id=$3`, [link, description, postId])
}

export function searchPosts(){
    return db.query('SELECT * FROM posts ORDER BY createdAt DESC LIMIT 20')
}

export function searchLikes(idPost){
    return db.query(`SELECT * FROM likes WHERE "idPost"=$1`, [idPost]);
}

export function searchUserLike(idUser, idPost){
    return db.query(`SELECT * FROM likes WHERE "idUser"=$1 AND "idPost"=$2`, [idUser, idPost]);
}

export function likePostDB(idUser, idPost){
    return db.query(`INSERT INTO likes ("idUser", "idPost") VALUES ($1, $2)`, [idUser, idPost]);
}

export function dislikePost(idUser, idPost){
    return db.query(`DELETE FROM likes WHERE "idPost" =$1 AND "idUser" =$2 `, [idPost, idUser]);
}

export function postComments(idUser, idPost, comment){
    return db.query(`INSERT INTO "comments" ("idUser", "idPost", "comment") VALUES ($1, $2, $3)`, [idUser, idPost, comment]);
}

export function getComments(idPost){
    return db.query(`SELECT * FROM "comments" WHERE "idPost"=$1`, [idPost]);
}