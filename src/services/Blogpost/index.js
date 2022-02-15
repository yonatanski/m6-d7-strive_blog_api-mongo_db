import express from "express"
import createHttpError from "http-errors"
import BlogsModel from "./schema.js"

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

export default blogsRouter
