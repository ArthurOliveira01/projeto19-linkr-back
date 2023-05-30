import { searchEmail } from "../repositories/authorization.repository.js"

export function validateSignup(schema) {
    return (req, res, next) => {
        const {name, email, password, foto} = req.body
        res.locals.name = name
        res.locals.email = email
        res.locals.password = password
        res.locals.foto = foto

        const validation = schema.validate(req.body, {abortEarly: false})

        if(validation.error) {
            const errors = validation.error.details.map(err=>err.message)
            return res.status(422).send(errors)
        }
        next()
    }
}

export async function validateEmail(req, res, next) {
    const {email} = req.body

    try {
        const emailValidation = await searchEmail(email)
        if(emailValidation.rowCount !== 0) return res.sendStatus(409)
        next()
    } catch (err) {
        console.log(err)
    }
}