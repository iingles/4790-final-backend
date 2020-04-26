// Core Node modules
import http from 'http'

// NPM packages
import express from 'express'
import cookieParser from 'cookie-parser'
import { ApolloServer, PubSub } from 'apollo-server-express'
import mongoose from 'mongoose'
import { verify } from 'jsonwebtoken'
import bodyParser from 'body-parser'

// GraphQL schema/resolvers
import { typeDefs } from './schema/schema'
import { resolvers } from './resolvers/resolvers'

import { User } from '../models/User'
// import { createTokens, auth } from './middleware/auth'
import { auth } from './middleware/auth'

require('dotenv').config()

// Utitlity constants
const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.port || 4000
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET


// For subscriptions
const pubsub = new PubSub()

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.  The third parameter is the context.

const startServer = async () => {
    const app = express()

    const validateToken = authToken => {
        // ... validate token and return a Promise, rejects in case of an error
        
    };

    const findUser = authToken => {
        return tokenValidationResult => {
            // ... finds user by auth token and return a Promise, rejects in case of an error

        };
    };

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

    // Authentication using cookies
    // app.use(cookieParser())
    
    app.use((req, res, next) => {
        if (req.method === 'OPTION') {
            res.sendStatus(200)
        }
        next()
    })

    //application/json
    app.use(bodyParser.json());
    app.use(auth)
    
    // app.use(async (req, res, next) => {
    //     // accessToken should have been set at login
    //     const accessToken = req.cookies["accessToken"]
    //     const refreshToken = req.cookies["refreshToken"]

    //     // Check to see if we got tokens from the cookies

    //     if (!refreshToken && !accessToken) {
    //         return next()
    //     }

    //     try {
           
    //         // Make sure that the cookie matches the secret
    //         const data = verify(accessToken, ACCESS_TOKEN_SECRET)
    //         // If there is a userId on the request, we know that the token has been verified
    //         req.userId = data.userId
    //         return next()
    //     } catch { }

    //     if (!refreshToken) {
            
    //         return next()
    //     }
        
    //     let data

    //     // If there is a refresh token, verify it
    //     try {
    //         // Make sure that the cookie matches the secret
    //         data = verify(refreshToken, ACCESS_TOKEN_SECRET)
    //         // If there is a userId on the request, we know that the token has been verified
    //     } catch {
    //         return next()
    //     }

    //     const user = await User.findById(data.userId)

    //     const tokens = createTokens(user) 

    //     res.cookie('refreshToken', tokens.refreshToken, {
    //         expire: 60 * 60 * 24 * 7,
    //         httpOnly: true,
    //         // secure: true
    //     })

    //     res.cookie('accessToken', tokens.accessToken, {
    //         expire: 60 * 15,
    //         httpOnly: true,
    //         // secure: true
    //     })

    //     req.userId = user._id

        // next()
    // })
    
    const corsOptions = {
        origin: 'http://206.189.215.72/',
        credentials: true, // <-- REQUIRED backend setting
    }

    const httpServer = http.createServer(app)
    
    server.applyMiddleware({ app, cors: corsOptions }) // app is from existing express app
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
        console.log(`Server listening at port http://localhost:${PORT}/graphql`)
        console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath} `)
    })
    
   
}

startServer()



