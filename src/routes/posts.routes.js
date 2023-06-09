import { Router } from "express";
import { postContent, deleteContent, updateContent, getPosts, likePost, unlikePost, postComment, getComment} from "../controllers/posts.controller.js";
import { validateSession, validateContent, validateUpdate, validateComment } from "../middlewares/posts.middleware.js";
import { postsSchema } from "../schemas/posts.schema.js";
import { commentSchema } from "../schemas/comment.schema.js";
import { getComments } from "../repositories/post.repository.js";

const postsRouter = Router();

postsRouter.post("/content", validateSession, validateContent(postsSchema), postContent);
postsRouter.delete("/content/:postId", validateSession, deleteContent);
postsRouter.put("/content", validateSession, validateUpdate(postsSchema), updateContent);
postsRouter.get("/content", getPosts)
postsRouter.post("/like", validateSession, likePost);
postsRouter.delete("/like/:idPost", validateSession, unlikePost);
postsRouter.post("/comment", validateSession, validateComment(commentSchema), postComment);
postsRouter.get("/comment/:idPost", getComment)

export default postsRouter;