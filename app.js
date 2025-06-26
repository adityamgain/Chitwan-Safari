const express = require('express');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const ejsMate = require('ejs-mate');
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const pageRoutes = require('./routes/pageRoutes');
const viewRoutes = require('./routes/viewRoutes');
const homeRoutes = require('./routes/homeRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

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
    app.use(methodOverride('_method'));
    app.use(express.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Static files
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/css', express.static(path.join(__dirname, 'public/css')));
    app.use('/images', express.static(path.join(__dirname, 'public/images')));

    // GraphQL endpoint
    app.use('/graphql', expressMiddleware(graphqlServer));

    // Page routes
    app.use('/', viewRoutes);
    app.use('/', homeRoutes);
    app.use('/', pageRoutes);
    app.use('/', mediaRoutes);

    app.listen(1212, () => {
        console.log('Express server running at http://localhost:1212');
        console.log('GraphQL server ready at http://localhost:1212/graphql');
        console.log('Namaste from Kathmandu!');
    });
}

startServer();
