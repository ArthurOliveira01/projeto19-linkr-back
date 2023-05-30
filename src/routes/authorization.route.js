import { Router } from "express"
import { signup } from "../controllers/authorization.controller.js"
import { validateEmail, validateSignup } from "../middlewares/authorization.middleware.js"
import { userSchema } from "../schemas/authorization.schema.js"

const authorizationRouter = Router()

authorizationRouter.post("/signup", validateEmail, validateSignup(userSchema), signup)

export default authorizationRouter