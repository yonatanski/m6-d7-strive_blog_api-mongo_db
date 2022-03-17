import express from "express"
import AuthorModel from "./schema.js"
import multer from "multer" // it is middleware
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { basicAuthMiddleware } from "../Auth/basic.js"
import { JWTAuthMiddleware } from "../Auth/token.js"
import createError from "http-errors"
import { authenticateUser } from "../Auth/tools.js"
import { adminOnlyMiddleware } from "../Auth/authorOnOnly.js"

const cloudinaryAvatarUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // search automatically for process.env.CLOUDINARY_URL
    params: {
      folder: "blogpostAvatar-Mongo",
    },
  }),
}).single("avatar")

const authorsRouter = express.Router()

authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const Author = await AuthorModel.checkCredentials(email, password)
    if (Author) {
      const accessToken = await authenticateUser(Author)
      res.send({ accessToken })
    } else {
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})
authorsRouter.post("/registration", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const Author = await AuthorModel.checkCredentials(email, password)
    if (Author) {
      const accessToken = await authenticateUser(Author)
      res.send({ accessToken })
    } else {
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body)
    const { _id } = await newAuthor.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const Author = await AuthorModel.find()
    res.send(Author)
  } catch (error) {
    next(error)
  }
})
authorsRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const author = await AuthorModel.findById(req.author._id)
    res.send(author)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:authorId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const Author = await AuthorModel.findById(req.params.authorId)
    res.send(Author)
  } catch (error) {
    next(error)
  }
})
authorsRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await AuthorModel.findByIdAndUpdate(req.author._id, req.body, { new: true })
    res.send(user)
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/:authorId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})
authorsRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await AuthorModel.findByIdAndDelete(req.author._id)
    res.send()
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:authorId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})
// *********************************************** IMAGE UPLOAD ***********************************************
authorsRouter.post("/:authorId/uploadSingleAvatar", cloudinaryAvatarUploader, async (req, res, next) => {
  try {
    const updateBlog = await AuthorModel.findByIdAndUpdate(
      req.params.authorId,
      { avatar: req.file.path },
      {
        new: true,
      }
    )
    if (updateBlog) {
      res.send(updateBlog)
    } else {
      next(createHttpError(404, `Blog witth id${req.params.authorId} found!`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default authorsRouter
