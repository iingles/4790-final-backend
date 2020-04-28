// Core Node modules
import http from 'http'

// NPM packages
import express from 'express'
import { ApolloServer, PubSub } from 'apollo-server-express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

// GraphQL schema/resolvers
import { typeDefs } from './schema/schema'
import { resolvers } from './resolvers/resolvers'


// import { createTokens, auth } from './middleware/auth'
import { auth } from './middleware/auth'

require('dotenv').config()

// Utitlity constants
const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000

// For subscriptions
const pubsub = new PubSub()

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.  The third parameter is the context.
const startServer = async () => {
    const app = express()

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req, res }) => ({
            req,
            res,
            pubsub
        }),
        subscriptions: {
            onConnect: (connectionParams, ws, ctx) => {
                // console.log('connect')
            },

            onDisconnect: (ws, ctx) => {
                // console.log('disconnect')
            }
        }
    })

    app.use((req, res, next) => {
        if (req.method === 'OPTION') {
            res.sendStatus(200)
        }
        next()
    })

    //application/json
    app.use(bodyParser.json());

    // Authentication middleware
    app.use(auth)

    const corsOptions = {
        origin: 'http://206.189.215.72',
        // origin: 'http://localhost:8080',
        credentials: true, // <-- REQUIRED backend setting
    }

    const httpServer = http.createServer(app)

    // Using Apollo's built-in CORS
    // app is from existing express app
    server.applyMiddleware({ app, cors: corsOptions })

    // Subscription handlers
    server.installSubscriptionHandlers(httpServer);


    mongoose
        .connect(MONGODB_URI, { useUnifiedTopology: true })
        .then(result => {
            console.log('Database connection successful')
        })
        .catch(err => {
            console.log(err)
        })

    httpServer.listen(PORT, () => {
        console.log(`Server listening at HTTP port ${PORT}/graphql`)
        console.log(`Subscriptions ready at ws port ${PORT}${server.subscriptionsPath} `)
    })


}

startServer()



