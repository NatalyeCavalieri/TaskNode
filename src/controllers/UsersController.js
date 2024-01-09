const { hash } = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

class UsersController{
  async create(request, response){
    const { name, email, password } = request.body
    const database = await sqliteConnection()
    const checkUsersExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    if(checkUsersExists){
      throw new AppError("This email already exists")
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    )
    return response.status(201).json()
}

  async update(request, response){
   const {name, email} = request.body
   const { id } = request.params

   const database = await sqliteConnection()
   const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])
   if(!user){
    throw new AppError("User not exists")
   }

   const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])
   if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
    throw new AppError ("This email already exists")
   }
   user.name = name
   user.email = email 

   await database.run(`
   UPDATE users SET
    name = ?,
    email = ?,
    updated_at = ?
    WHERE id = ?`,
    [user.name, user.email, new Date(), id]
    )
    return response.json()
  
  }
}

module.exports = UsersController