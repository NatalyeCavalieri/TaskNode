const { Router } = require("express")

const TasksController = require("../controllers/TasksController")
const tasksRoutes = Router()


const tasksController = new TasksController()

tasksRoutes.post("/:user_id", tasksController.create)

module.exports = tasksRoutes