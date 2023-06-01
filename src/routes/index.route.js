import { Router } from "express"
import authorizationRouter from "./authorization.route.js"
import hashtagRouter from "./hashtag.route.js"

const router = Router()

router.use(authorizationRouter)
router.use(hashtagRouter)

export default router