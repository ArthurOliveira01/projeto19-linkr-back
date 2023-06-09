import { Router } from "express";
import { postContent, deleteContent, updateContent, getPosts, likePost, unlikePost } from "../controllers/posts.controller.js";
import { validateSession, validateContent, validateUpdate } from "../middlewares/posts.middleware.js";
import { postsSchema } from "../schemas/posts.schema.js";

const postsRouter = Router();

postsRouter.post("/content", validateSession, validateContent(postsSchema), postContent);
postsRouter.delete("/content/:postId", validateSession, deleteContent);
postsRouter.put("/content", validateSession, validateUpdate(postsSchema), updateContent);
postsRouter.get("/content", getPosts)
postsRouter.post("/like", validateSession, likePost);
postsRouter.delete("/like/:idPost", validateSession, unlikePost);

export default postsRouter;