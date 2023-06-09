import bcrypt from "bcrypt"
import { insertNewSession, insertNewUser, searchUser } from "../repositories/authorization.repository.js"
import { searchSession } from "../repositories/post.repository.js"
import {v4 as uuid} from "uuid"
import { db } from "../database/databaseconnectio.js"

export async function signup(req, res) {
    const {name, email, password, foto} = res.locals
    const encryptedPassword = bcrypt.hashSync(password, 10)

    try {
        await insertNewUser(name, email, encryptedPassword, foto)
        res.sendStatus(201)
    } catch (err) {
        console.log(err.message)
    }
}

export async function signin(req, res) {
    const {idUser} = res.locals
    const token = uuid()
    const resToken = {token: token}

    try {
        await insertNewSession(idUser, token)
        res.send(resToken)
    } catch (err) {
        console.log(err)
    }
}

export async function getUserbyId(req,res){
    const id = parseInt(req.params.id);
    let {page} = req.headers;

    if(!page){
        page = 1;
    }
  
    if (!id) return res.sendStatus(404);
    

    try {

        const query = await db.query(
            `SELECT * FROM users WHERE id=$1`
        ,[id]);
        if(query.rows.length === 0){
            return res.sendStatus(400);
            //400
        }
        const query2 = await db.query(`
          SELECT * FROM posts WHERE "idUser"=$1
         `,[id]);
        const obj={
            name: query.rows[0].name,
            foto: query.rows[0].foto,
            posts:query2.rows.slice(0,10*page)
        }
        return res.send(obj)
        
    } catch (error) {
        return res.sendStatus(500);
        //500
    }
   

}

export async function getUsers(req,res){

    const search = req.headers.search;
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');

    if(!authorization){
        return res.sendStatus(401)
    }
    console.log("search: " + search);

    

    try {
        const session = await db.query(`
         SELECT * FROM login WHERE token=$1
        `,[token]);
        if(session.rows.length === 0){
            return  res.sendStatus(401)
        }
        console.log(session.rows);
        const user = await db.query(`
        SELECT * FROM users WHERE id=$1
        `,[session.rows[0].idUser]);
        const userid = user.rows[0].id;
        console.log("userid: " + userid)

        const query = await db.query(`
        SELECT * 
        FROM users 
        WHERE name LIKE '%' || $1 || '%'
        LIMIT 4
        `, [search]);
        console.log("like: ");
        console.log(query.rows);
        const busca = query.rows;
        const segue = [];
        for(const i of busca){
            const pegarid = await db.query(`
            SELECT * FROM users
            WHERE name=$1
            `, [i.name]);
            console.log("Id: ")
            console.log(pegarid.rows[0].id);
            
            const conferir = await db.query(`
            SELECT * FROM follows
            WHERE "followerId"=$1 AND "followedId"=$2
            `, [pegarid.rows[0].id, userid]);
            console.log(conferir.rows.length);
            if(conferir.rows.length !== 0){
                i.follow = true;
                segue.push(i)
            }
            else{
                i.follow = false;
            } 
        };
        const naosegue = busca.filter((b => !segue.includes(b)));
        let ar = [];
        for(const i of segue){
            ar.push(i)
        }
        for(const i of naosegue){
            ar.push(i)
        }
        return res.send(ar);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function sendInfo(req, res) {
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");
    try {
        const userFind = await searchSession(token);
        const userId = userFind.rows[0].idUser;
        const userInfo = await searchUser(userId);
        const object = {
            id: userInfo.rows[0].id,
            name: userInfo.rows[0].name,
            email: userInfo.rows[0].email,
            foto: userInfo.rows[0].foto
        }
        return res.status(200).send(object);
    } catch (err) {
        return res.status(500).send(err.message);
    }
}