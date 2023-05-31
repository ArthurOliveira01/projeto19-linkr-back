import { Router } from "express"
import authorizationRouter from "./authorization.route.js"
import postsRouter from "./posts.routes.js";
const router = Router()

router.use(authorizationRouter)
router.use(postsRouter);

export default router