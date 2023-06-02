import { Router } from "express"
import { getUserbyId, signin, signup } from "../controllers/authorization.controller.js"
import { validateEmail, validateSignup, validateUser } from "../middlewares/authorization.middleware.js"
import { userSchema } from "../schemas/authorization.schema.js"

const authorizationRouter = Router()

authorizationRouter.post("/signup", validateEmail, validateSignup(userSchema), signup)
authorizationRouter.post("/", validateUser, signin)
authorizationRouter.get("/user/:id", getUserbyId);

export default authorizationRouter