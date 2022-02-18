import mongoose from "mongoose"
const { Schema, model } = mongoose

const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    //   *************************************
    title: { type: String, required: true },
    //   *************************************
    cover: { type: String, required: false },
    //   *************************************
    readTime: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
    //   *************************************
    author: [{ type: Schema.Types.ObjectId, ref: "Author" }],

    //   *************************************
    content: { type: String, required: false },
    //   *************************************
    comment: [
      {
        userName: { type: String },
        content: { type: String },
      },
    ],
  },

  {
    timestamps: true,
  }
)
blogSchema.static("findBlogssWithAuthors", async function (mongoQuery) {
  const total = await this.countDocuments(mongoQuery.criteria) // If I use a normal function (not an arrow) here, the "this" keyword will give me the possibility to access to BooksModel
  const blogs = await this.find(mongoQuery.criteria)
    .limit(mongoQuery.options.limit)
    .skip(mongoQuery.options.skip)
    .sort(mongoQuery.options.sort) // no matter in which order you call this options, Mongo will ALWAYS do SORT, SKIP, LIMIT in this order
    .populate({
      path: "author",
      select: "name avatar",
    })
  return { total, blogs }
})

export default model("Blog", blogSchema)
