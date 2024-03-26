/*
    Returns the infographic for the daily shard
*/
const db = require("./connect-db")
require('dotenv').config()

function infographs(isRed, map) {
    console.log(isRed, " ", map)
    return new Promise((resolve, reject) => {
        let query;

        if (isRed) {
            query = `
                SELECT img
                FROM shard
                WHERE type = 'red' AND map = '${map}'`;
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error querying the database ', err);
                    reject(err);
                    return;
                }

                if (results.length > 0) {
                    const item = results[0].img;
                    resolve(item);
                } else {
                    reject(new Error('No results found'));
                }
            });
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