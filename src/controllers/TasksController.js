const { request, response } = require("express")
const knex = require("../database/knex")

class TasksController {
  async create(request, response) {
    const { title, description, tags, status } = request.body
    const { user_id } = request.params

    const [task_id] = await knex("tasks").insert({
      title,
      description,
      status,
      user_id,
    })
    const tagsInsert = tags.map((name) => {
      return {
        task_id,
        user_id,
        name,
      }
    })
    await knex("tags").insert(tagsInsert)
    response.json()
  }

  async show(request, response) {
    const { id } = request.params
    const task = await knex("tasks").where({ id }).first()
    const tags = await knex("tags").where({ task_id: id }).orderBy("name")
    return response.json({
      ...task,
      tags,
    })
  }

  async delete(request, response) {
    const { id } = request.params
    await knex("tasks").where({ id }).delete()
    return response.json()
  }

  async index(request, response){
    const {user_id} = request.query
    const tasks = await knex("tasks").where({user_id}).orderBy("title")
    return response.json(tasks)
  }
}

module.exports = TasksController
