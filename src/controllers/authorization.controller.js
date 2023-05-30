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