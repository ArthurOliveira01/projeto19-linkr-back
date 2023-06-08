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
            posts:query2.rows
        }
        return res.send(obj)
        
    } catch (error) {
        return res.sendStatus(500);
        //500
    }
   

}

export async function getUsers(req,res){

    const {search} = req.headers;
    

    

    try {
        const query = await db.query(`
        SELECT * FROM users WHERE name LIKE '%' || $1 || '%'
        `, [search]);
        return res.send(query.rows.slice(0,4))
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function sendInfo(req, res) {
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer ", "");
    console.log(token);
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
        console.log(object);
        return res.status(200).send(object);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err.message);
    }
}