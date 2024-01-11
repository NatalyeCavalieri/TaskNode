const { Router } = require("express")

const usersRouter = require("./users.routes")
const tasksRouter = require("./tasks.routes")

const routes = Router()
routes.use("/users", usersRouter)
routes.use("/:user_id", tasksRouter)

module.exports = routes