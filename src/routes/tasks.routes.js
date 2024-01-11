const { Router } = require("express")

const TasksController = require("../controllers/TasksController")
const tasksRoutes = Router()


const tasksController = new TasksController()

tasksRoutes.post("/:user_id", tasksController.create)
tasksRoutes.get("/:id", tasksController.show)
tasksRoutes.delete("/:id", tasksController.delete)

module.exports = tasksRoutes