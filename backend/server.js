const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();
app.use(cors({ origin: '*' }));

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req })  // ✅ Pass Request Headers
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    mongoose
        .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log(`✅ MongoDB Connected`);
            app.listen(process.env.PORT, () => {
                console.log(`🚀 Server running at http://localhost:${process.env.PORT}/graphql`);
            });
        })
        .catch((err) => {
            console.error('❌ MongoDB Connection Error:', err);
            process.exit(1);
        });
}

startServer();
