const db = require('../config/database');

const resolvers = {
    Query: {
        hello: () => 'Greetings from the Himalayas!',

        reviews: async () => {
            return new Promise((resolve, reject) => {
                db.query('SELECT * FROM tbl_Reviews', (err, results) => {
                    if (err) {
                        console.error('DB error:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
        },
    },
};

module.exports = resolvers;