import bcrypt from "bcrypt"
import { insertNewSession, insertNewUser } from "../repositories/authorization.repository.js"
import {v4 as uuid} from "uuid"

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
        return res.send(query.rows[0])
        
    } catch (error) {
        return res.sendStatus(500);
        //500
    }
   

}

export async function getUsers(req,res){

    const {search} = req.body;

    try {
        const query = await db.query(`
        SELECT * FROM users WHERE name LIKE '$1%'
        `, [search]);
        //incompleto
    } catch (error) {
        
    }
}