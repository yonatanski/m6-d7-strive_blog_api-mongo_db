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
    author: {
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: false,
      },
    },

    //   *************************************
    content: { type: String, required: false },
    //   *************************************
  },
  {
    timestamps: true,
  }
)
export default model("Blog", blogSchema)
