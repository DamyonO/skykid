const db = require("./connect-db")
require('dotenv').config()



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