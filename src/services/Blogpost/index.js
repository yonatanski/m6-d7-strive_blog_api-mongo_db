import express from "express"
import createHttpError from "http-errors"
import BlogsModel from "./schema.js"
import multer from "multer" // it is middleware
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // search automatically for process.env.CLOUDINARY_URL
    params: {
      folder: "blogpost-Mongo",
    },
  }),
}).single("cover")
const cloudinaryAvatarUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // search automatically for process.env.CLOUDINARY_URL
    params: {
      folder: "blogpostAvatar-Mongo",
    },
  }),
}).single("avatar")

const blogsRouter = express.Router()
// POST ***********************************************
blogsRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogsModel(req.body)
    const { _id } = await newBlog.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})
// GET ***********************************************
blogsRouter.get("/", async (req, res, next) => {
  try {
    const getBlog = await BlogsModel.find()

    if (getBlog) {
      res.send(getBlog)
    } else {
      next(createHttpError(404, `Blog not found!`))
    }
  } catch (error) {
    next(error)
  }
})
// GET WITH ID ***********************************************
blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const getBlog = await BlogsModel.findById(req.params.blogId)

    if (getBlog) {
      res.send(getBlog)
    } else {
      next(createHttpError(404, `Blog witth id${eq.params.blogId} found!`))
    }
  } catch (error) {
    next(error)
  }
})
// PUT WITH ID ***********************************************
blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const updateBlog = await BlogsModel.findByIdAndUpdate(req.params.blogId, req.body, {
      new: true,
    })

    if (updateBlog) {
      res.send(updateBlog)
    } else {
      next(createHttpError(404, `Blog witth id${eq.params.blogId} found!`))
    }
  } catch (error) {
    next(error)
  }
})
// DELETE WITH ID ***********************************************
blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const deltedBlog = await BlogsModel.findByIdAndDelete(req.params.blogId)

    if (deltedBlog) {
      res.send({ message: `USER WITH ID ${req.params.blogId} DELTED SUCCESSFULLY!` })
    } else {
      next(createHttpError(404, `Blog witth id${req.params.blogId} found!`))
    }
  } catch (error) {
    next(error)
  }
})
// *********************************************** IMAGE UPLOAD ***********************************************
blogsRouter.post("/:blogId/uploadSingleCover", cloudinaryUploader, async (req, res, next) => {
  try {
    const updateBlog = await BlogsModel.findByIdAndUpdate(
      req.params.blogId,
      { cover: req.file.path },
      {
        new: true,
      }
    )
    if (updateBlog) {
      res.send(updateBlog)
    } else {
      next(createHttpError(404, `Blog witth id${req.params.blogId} found!`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default blogsRouter
