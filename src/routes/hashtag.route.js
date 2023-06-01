import { Router } from "express"
import { getHashtags } from "../controllers/hashtag.controller.js"

const hashtagRouter = Router()

hashtagRouter.get("/hashtags", getHashtags)

export default hashtagRouter