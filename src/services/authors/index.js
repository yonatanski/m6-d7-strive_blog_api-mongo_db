import express from "express"
import AuthorModel from "./schema.js"
import multer from "multer" // it is middleware
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const cloudinaryAvatarUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // search automatically for process.env.CLOUDINARY_URL
    params: {
      folder: "blogpostAvatar-Mongo",
    },
  }),
}).single("avatar")

const authorsRouter = express.Router()

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body)
    const { _id } = await newAuthor.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:authorId", async (req, res, next) => {
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
