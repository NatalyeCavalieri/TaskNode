exports.up = knex => knex.schema.createTable("tags", table => {
    table.increments("id")
    table.text("name").notNullable()
    table.integer("task_id").references("id").inTable("tasks").onDelete("CASCADE")
    table.integer("user_id").references("id").inTable("users")

  })

exports.down = (knex) => knex.schema.dropTable("tags")
