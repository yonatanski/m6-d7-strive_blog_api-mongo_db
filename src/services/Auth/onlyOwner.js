import BlogsModel from "../Blogpost/schema.js"

const onlyOwner = async (req, res, next) => {
  const blog = await BlogsModel.findById(req.params.blogId)

  if (blog.author._id.toString() !== req.author._id.toString()) {
    res.status(403).send({ message: "You are not the owner of this blog post!" })
    return
  } else {
    req.blog = blog
    next()
  }
}

export default onlyOwner
