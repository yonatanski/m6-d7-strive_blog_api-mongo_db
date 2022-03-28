import express from "express"
import createHttpError from "http-errors"
import BlogsModel from "./schema.js"
import multer from "multer" // it is middleware
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import q2m from "query-to-mongo"
import { JWTAuthMiddleware } from "../Auth/token.js"
import { adminOnlyMiddleware } from "../Auth/authorOnOnly.js"

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
blogsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newBlog = new BlogsModel({ ...req.body, author: [req.author._id] })
    const { _id } = await newBlog.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})
// GET ***********************************************
blogsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    // console.log("QUERY ", req.query)
    // console.log("QUERY-TO-MONGO: ", q2m(req.query))
    const mongoQuery = q2m(req.query)
    const { total, blogs } = await BlogsModel.findBlogssWithAuthors(mongoQuery)

    res.send({
      links: mongoQuery.links("/blogposts", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      blogs,
    })
  } catch (error) {
    next(error)
  }
})
// GET WITH ID ***********************************************
blogsRouter.get("/:blogId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const getBlog = await BlogsModel.findById(req.params.blogId).populate({
      path: "author",
      select: "name surname avatar",
    })

    if (getBlog) {
      res.send(getBlog)
    } else {
      next(createHttpError(404, `Blog witth id${req.params.blogId} found!`))
    }
  } catch (error) {
    next(error)
  }
})
// PUT WITH ID ***********************************************
blogsRouter.put("/:blogId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
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
blogsRouter.delete("/:blogId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
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
// *********************************************** Route for COMMENTS ***********************************************

blogsRouter.post("/:blogId/comments", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log("request params id,", req.params.blogId)
    console.log("request params id,", req.body)
    const newComment = req.body

    const getBlog = await BlogsModel.findByIdAndUpdate(req.params.blogId, { $push: { comment: newComment } })

    console.log(getBlog)
    if (getBlog) {
      //   const blogCommented = { ...getBlog.toObject(), comment: [...getBlog.comment, newComment] }
      //   await getBlog.save()
      res.send(getBlog)
    }
  } catch (error) {
    next(error)
  }
})
blogsRouter.get("/:blogId/comments", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log("request params id,", req.params.blogId)
    console.log("request params id,", req.body)
    const newComment = req.body

    const getBlog = await BlogsModel.findById(req.params.blogId)

    console.log(getBlog)
    if (getBlog) {
      res.send(getBlog.comment)
    }
  } catch (error) {
    next(error)
  }
})
// blogsRouter.get("/:blogId/comments", async (req, res, next) => {
//   try {
//     console.log("request params id,", req.params.blogId)
//     console.log("request params id,", req.body)
//     const newComment = req.body

//     const getBlog = await BlogsModel.findById(req.params.blogId)

//     console.log(getBlog)
//     if (getBlog) {
//       res.send(getBlog.comment)
//     }
//   } catch (error) {
//     next(error)
//   }
// })
blogsRouter.get("/:blogId/comments/:commentId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log("request params id,", req.params.blogId)
    console.log("request params id,", req.body)
    const newComment = req.body

    const getBlog = await BlogsModel.findById(req.params.blogId)

    console.log(getBlog)
    if (getBlog) {
      const slecetedComment = getBlog.comment.find((blog) => blog._id == req.params.commentId)
      res.send(slecetedComment)
    } else {
      next(createHttpError(404, `Comment witth id${req.params.commentId} found!`))
    }
  } catch (error) {
    next(error)
  }
})
blogsRouter.put("/:blogId/comments/:commentId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    console.log("request params id,", req.params.blogId)
    console.log("request params id,", req.body)

    const getBlog = await BlogsModel.findById(req.params.blogId)

    console.log(getBlog)
    if (getBlog) {
      const index = getBlog.comment.findIndex((blog) => blog._id == req.params.commentId)
      if (index !== -1) {
        // we can modify user.purchaseHistory[index] element with what comes from request body
        getBlog.comment[index] = {
          ...getBlog.comment.toObject(), // DO NOT FORGET .toObject() when spreading
          ...req.body,
        }
        await getBlog.save()
        res.send(getBlog)
      } else {
        next(createHttpError(404, `Comment witth id${req.params.commentId} found!`))
      }
    }
  } catch (error) {
    next(error)
  }
})
blogsRouter.delete("/:blogId/comments/:commentId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    console.log("request params id,", req.params.blogId)
    console.log("request params id,", req.body)

    const updatedComment = await BlogsModel.findByIdAndUpdate(req.params.blogId, { $pull: { comment: { _id: req.params.commentId } } })

    console.log(updatedComment)
    if (updatedComment) {
      res.send({ message: `Comment witth id${req.params.commentId} Deleted!!` })
    } else {
      next(createHttpError(404, `Comment witth id${req.params.commentId} found!`))
    }
  } catch (error) {
    next(error)
  }
})

// *********************************************** END for COMMENTS ***********************************************

// *********************************************** IMAGE UPLOAD ***********************************************
blogsRouter.post("/:blogId/uploadSingleCover", cloudinaryUploader, JWTAuthMiddleware, async (req, res, next) => {
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
