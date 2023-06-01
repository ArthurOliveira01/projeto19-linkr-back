import { Router } from "express"
import authorizationRouter from "./authorization.route.js"
<<<<<<< HEAD
import hashtagRouter from "./hashtag.route.js"

const router = Router()

router.use(authorizationRouter)
router.use(hashtagRouter)
=======
import postsRouter from "./posts.routes.js";
const router = Router()

router.use(authorizationRouter)
router.use(postsRouter);
>>>>>>> ddc73da1647aeddb45bf5f4f21e90ff5af094f78

export default router