export function validateSignup(schema) {
    return (req, res, next) => {
        const {name, email, password, foto} = req.body
        res.locals.name = name
        res.locals.email = email
        res.locals.password = password
        res.locals.foto = foto

        const validation = schema.validate(req.body, {abortEarly: false})

        if(validation.error) {
            const errors = validation.errors.details.map(err=>err.message)
            return res.status(422).send(errors)
        }
        next()
    }
}