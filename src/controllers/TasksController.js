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
    const {title, user_id, tags} = request.query

    let tasks

    if(tags){
      const filterTags = tags.split(',').map(tag => tag.trim())
      tasks = await knex("tags")
        .select(["tasks.id", "tasks.title", "tasks.user_id"])
        .where("tasks.user_id", user_id)
        .whereLike("tasks.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("tasks", "tasks.id", "tags.task_id")
        .orderBy("tasks.title")

    }else{
      tasks = await knex("tasks")
      .where({user_id})
      .whereLike("title", `%${title}%`)
      .orderBy("title")
    }

    const userTags = await knex("tags").where({user_id})
    const tasksWithTags = tasks.map(task => {
      const taskTags = userTags.filter(tag => tag.task_id === task.id)
      return{
        ...task,
        tags: taskTags
      }
    })
    return response.json(tasksWithTags)
  }
}

module.exports = TasksController
