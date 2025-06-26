const express = require('express');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const ejsMate = require('ejs-mate');
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this

const pageRoutes = require('./routes/pageRoutes');
const viewRoutes = require('./routes/viewRoutes');
const homeRoutes = require('./routes/homeRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const adminMediaRoutes = require('./routes/adminMediaRoutes');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const app = express();
const graphqlServer = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await graphqlServer.start();

    // EJS setup
    app.engine('ejs', ejsMate);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.set('layout', 'layout');
    app.use(ejsLayouts);

    // Middleware
    app.use(cors()); // Enable CORS
    app.use(methodOverride('_method'));
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true })); // Add this for proper DELETE handling

    // Static files
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/css', express.static(path.join(__dirname, 'public/css')));
    app.use('/images', express.static(path.join(__dirname, 'public/images')));
    app.use('/videos', express.static(path.join(__dirname, 'public/videos'))); // Add this

    // GraphQL endpoint
    app.use('/graphql', expressMiddleware(graphqlServer));

    // Routes
    app.use('/', viewRoutes);
    app.use('/', homeRoutes);
    app.use('/', pageRoutes);
    app.use('/', mediaRoutes);
    app.use('/admin', adminMediaRoutes); // Changed to /admin prefix

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    app.listen(1212, () => {
        console.log('Express server running at http://localhost:1212');
        console.log('GraphQL server ready at http://localhost:1212/graphql');
        console.log('Namaste from Kathmandu!');
    });
}

startServer();