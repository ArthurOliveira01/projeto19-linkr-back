import { Router } from "express"
import authorizationRouter from "./authorization.route.js"

const router = Router()

router.use(authorizationRouter)

export default router