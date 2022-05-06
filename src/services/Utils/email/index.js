import sgMail from "@sendgrid/mail"
import { BlogPostMailTemplate } from "./template/blogPost.js"

const { SENDGRID_API_KEY, SENGRID_EMAIL } = process.env

sgMail.setApiKey(SENDGRID_API_KEY)

const defaultParams = {
  from: SENGRID_EMAIL,
}

export const sendBlogPostMail = async ({ to, title, link }) => {
  try {
    const msg = {
      ...defaultParams,
      to,
      subject: "Your article has been published.",
      html: BlogPostMailTemplate({ title, link }),
    }
    console.log(msg)
    const sengridResponse = await sgMail.send(msg)
    console.log(sengridResponse)
  } catch (error) {
    console.error(error)
    if (error.response) {
      console.error(error.response.body)
    }
  }
}
