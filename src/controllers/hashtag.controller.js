import { db } from "../database/databaseconnectio.js"

export async function getHashtags (req, res) {
    try {
        const query = await db.query(`SELECT COUNT(hashtag), hashtag FROM hashtags GROUP BY hashtag ORDER BY count DESC LIMIT 10;`)
        res.send(query.rows)
    } catch (err) {
        console.log(err)
    }
}