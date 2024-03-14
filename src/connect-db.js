const mysql = require("mysql")
require('dotenv').config()

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "skydb"

})

db.getConnection(err =>{
    if(err){
        console.log(err.message)
        return
    }
    console.log("Database Connected")
})

module.exports = db