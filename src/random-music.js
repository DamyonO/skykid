const mysql = require("mysql")
require('dotenv').config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "skydb"

})

db.connect(err =>{
    if(err){
        console.log(err.message)
        return
    }
    console.log("Database Connected")
})


async function randomMusic(genre){
    return new Promise((resolve, reject) => {
        let query;
        if (genre === "random") {
            query = `
            SELECT link
            FROM music`;
        } else {
            query = `
                SELECT link
                FROM music
                WHERE genre = '${genre}'`;
        }

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error querying the database ', err);
                reject(err);
                return;
            }

            if (results.length > 0) {
                const randomIndex = Math.floor(Math.random() * results.length)
                const item = results[randomIndex].link;
                console.log(item);
                resolve(item);
            } else {
                resolve(false)
            }
        });
    });
}

module.exports = { randomMusic }