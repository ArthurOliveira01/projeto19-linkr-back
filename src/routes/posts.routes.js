import { Router } from "express";
import { postContent, deleteContent, updateContent } from "../controllers/posts.controller.js";
import { validateSession, validateContent, validateUpdate } from "../middlewares/posts.middleware.js";
import { postsSchema } from "../schemas/posts.schema.js";

const postsRouter = Router();

postsRouter.post("/content", validateSession, validateContent(postsSchema), postContent);
postsRouter.delete("/content", validateSession, deleteContent);
postsRouter.put("/content", validateSession, validateUpdate(postsSchema), updateContent);



export default postsRouter;