import express from "express"
import AuthorModel from "./schema.js"
import BlogsModel from "../Blogpost/schema.js"
import multer from "multer" // it is middleware
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { basicAuthMiddleware } from "../Auth/basic.js"

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
//  ------- Code from ubeyet on debrief (rajib)------------------------------
// authorsRouter.post("/login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body
//     const isMateched = await AuthorModel.checkCredentials(email, password)
//     if (isMateched) {
//       const token = Buffer.from(`${email}:${password}`).toString("base64")
//       res.status(201).send({ token })
//     } else {
//       res.status(404).send("Go Away MotherFucker!!")
//     }
//   } catch (error) {
//     next(error)
//   }
// })

authorsRouter.get("/me/stories", basicAuthMiddleware, async (req, res, next) => {
  try {
    const posts = await BlogsModel.find({ author: req.author._id.toString() })

    res.status(200).send(posts)
  } catch (error) {
    next(error)
  }
})
authorsRouter.get("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    res.status(200).send(req.author)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
  try {
    const Author = await AuthorModel.find()
    res.send(Author)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:authorId", basicAuthMiddleware, async (req, res, next) => {
  try {
    const Author = await AuthorModel.findById(req.params.authorId)
    res.send(Author)
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/:authorId", basicAuthMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:authorId", basicAuthMiddleware, async (req, res, next) => {
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
