const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const ejsMate = require('ejs-mate');
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const db = require('./config/database'); // Import your MySQL pool

const app = express();

// ---- GraphQL typeDefs and resolvers ----
const typeDefs = `
    type Query {
        hello: String
        activities: [Activity]
    }

    type Activity {
        id: ID
        name: String
        description: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Greetings from the foothills of the Himalayas!',

        activities: async () => {
            return new Promise((resolve, reject) => {
                db.query('SELECT id, name, description FROM activities', (err, results) => {
                    if (err) {
                        console.error('DB error fetching activities:', err);
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            });
        }
    },
};

// ---- Create Apollo Server ----
const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
});

// ---- Async function to start the server ----
async function startServer() {
    await graphqlServer.start();

    // ---- Express Middlewares ----
    app.engine('ejs', ejsMate);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.set('layout', 'layout');
    app.use(ejsLayouts);
    app.use(methodOverride('_method'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/css', express.static(path.join(__dirname, 'public/css')));
    app.use('/images', express.static(path.join(__dirname, 'public/images')));
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Apollo middleware
    app.use('/graphql', expressMiddleware(graphqlServer));

    // ---- Routes ----
    app.get('/', (req, res) => res.render('home'));
    app.get('/activities', (req, res) => res.render('activities'));
    app.get('/activities/safari', (req, res) => res.render('safari'));
    app.get('/activities/canoeing', (req, res) => res.render('canoening'));
    app.get('/activities/sunsets', (req, res) => res.render('sunsets'));
    app.get('/activities/tharu', (req, res) => res.render('tharu'));
    app.get('/activities/birdwatching', (req, res) => res.render('birdwatching'));
    app.get('/activities/homestay', (req, res) => res.render('homestay'));
    app.get('/activities/jungle-walk', (req, res) => res.render('jungle-walk'));
    app.get('/activities/jatayou-restaurant', (req, res) => res.render('jatayou-restaurant'));
    app.get('/booking', (req, res) => res.render('booking'));
    app.get('/bookings', (req, res) => res.render('booking-success'));
    app.get('/testimonials', (req, res) => res.render('testimonials'));

    app.listen(1212, () => {
        console.log('Express server running at http://localhost:1212');
        console.log('GraphQL server ready at http://localhost:1212/graphql');
        console.log('Namaste from Kathmandu!');
    });
}

// Start everything
startServer();
