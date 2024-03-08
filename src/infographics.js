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

function infographs(isRed, map) {
    return new Promise((resolve, reject) => {
        let query;

        if (isRed) {
            query = `
                SELECT img
                FROM shard
                WHERE type = 'red' AND map = '${map}'`;
        } else {
            query = `
                SELECT img
                FROM shard
                WHERE type = 'black' AND map = '${map}'`;

            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error querying the database ', err);
                    reject(err);
                    return;
                }

                if (results.length > 0) {
                    const item = results[0].img;
                    console.log(item);
                    resolve(item);
                } else {
                    reject(new Error('No results found'));
                }
            });
        }
    });
}

module.exports = {infographs}