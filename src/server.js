import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mongoose from "mongoose"
import blogsRouter from "./services/Blogpost/index.js"
import authorsRouter from "./services/authors/index.js"
import { unauthorizedHandler, catchAllHandler, forbiddenHandler } from "./errorHandlers.js"
import passport from "passport"
import googleStrategy from "./services/Auth/oauth.js"

const server = express()
const port = process.env.PORT || 3001
passport.use("google", googleStrategy)

// ************************************* MIDDLEWARES ***************************************.
server.use(cors())
server.use(express.json())
server.use(passport.initialize())
// ************************************* ROUTES ********************************************
server.use("/blogposts", blogsRouter)
server.use("/authors", authorsRouter)
// ************************************* ERROR MIDDLEWARES ***************************************.

server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server runnning on port: ", port)
  })
})
