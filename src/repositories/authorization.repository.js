import { db } from "../database/databaseconnectio.js"

export function insertNewUser (name, email, password, foto) {
    return db.query(`INSERT INTO users (name, email, password, foto) VALUES ($1, $2, $3, $4)`, [name, email, password, foto])
}

export function searchEmail(email) {
    return db.query(`SELECT * FROM users WHERE email=$1`, [email])
}