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
export default model("Blog", blogSchema)
