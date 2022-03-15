import createError from "http-errors"
import atob from "atob"
import AuthorModel from "../authors/schema.js"

export const basicAuthMiddleware = async (req, res, next) => {
  // Here we are going to receive something like --> Authorization: "Basic ZGllZ29AY2FzYXNvbGEuY29tOjEyMzQ="

  // 1. Check if Authorization header is provided, if it is not --> trigger an error (401)
  if (!req.headers.authorization) {
    next(createError(401, "Please provide credentials in Authorization header"))
  } else {
    // 2. If we have received the Authorization header, we should extract the credentials from it (which base64 encoded, therefore we should translate them into plain text)
    const base64Credentials = req.headers.authorization.split(" ")[1]

    const [email, password] = atob(base64Credentials).split(":")

    // 3. Once we obtain credentials, it's time to find the user in db (by email), compare received password with the hashed one
    const user = await AuthorModel.checkCredentials(email, password)

    if (user) {
      // 4. If credentials are ok, we can proceed to what is next (another middleware or route handler)
      req.user = user
      next()
    } else {
      // 5. If credentials are NOT ok (email not found OR password not correct) --> trigger an error (401)
      next(createError(401, "Credentials are not OK!"))
    }
  }
}
