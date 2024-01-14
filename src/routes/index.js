const { Router } = require("express")

const usersRouter = require("./users.routes")
const tasksRouter = require("./tasks.routes")
const tagsRouter = require("./tags.routes")

const routes = Router()
routes.use("/users", usersRouter)
routes.use("/tasks", tasksRouter)
routes.use("/tags", tagsRouter)


module.exports = routes