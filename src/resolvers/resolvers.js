// NPM packages
import bcrypt from 'bcryptjs'
import validator from 'validator'
// import jwt from 'jsonwebtoken'

// Mongoose models
import { User } from '../../models/User'
import { Post } from '../../models/Post'

// Tokens
import { createTokens } from '../middleware/auth'

// Emitted strings for subscriptions
const NEW_POST = "NEW POST"
const UPDATED_POST = "UPDATED POST"
const DELETED_POST = "DELETED POST"
const FOLLOWS_UPDATED = "FOLLOWS UPDATED"

// functions take 3 parameters: parent object, arguements, and context

export const resolvers = {
    Query: {
        getUser: async (_, { _id }, req) => {
            const user = await User.findById(_id)
            return user
        },

        posts: async (_, { page }, { req }) => {

            if (!req.isAuth) {
                const error = new Error('Not Authenticated')
                error.code = 401
                throw error
            }

            // Pagination

            if (!page) {
                page = 1
            }

            const perPage = 20 //hardcode this for now

            const totalPosts = await Post.find().countDocuments()
            const posts = await Post
                .find()
                .sort({ createdAt: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage)
                .populate('creator')

            return {
                posts: posts.map(p => {
                    return {
                        ...p._doc,
                        id: p._id.toString(),
                        createdAt: p.createdAt.toISOString(),
                        updatedAt: p.updatedAt.toISOString()
                    }
                }),
                totalPosts: totalPosts
            }
        }
    },

    Mutation: {
        createUser: async (_, {userInput}, req) => {
            // Validation

            // Make a stack of errors
            const errors = []

            console.log('hit')

            if (!validator.isEmail(userInput.email)) {
                errors.push({
                    message: 'Email is invalid.'
                })
            }

            if (
                validator.isEmpty(userInput.password) ||
                !validator.isLength(userInput.password, { min: 5 })
            ) {
                errors.push({
                    message: 'Password must be at least 5 characters.'
                })
            }

            if (errors.length > 0) {
                const error = new Error('Invalid input.')
                throw error
            }

            // Check to see if a user with that email already exists; if so, throw an error
            const existingUser = await User.findOne({ email: userInput.email })

            if (existingUser) {
                const error = new Error('User already exists!')
                error.data = errors
                error.code = 422
                throw error
            }

            // Encrypt the password
            const hashedPw = await bcrypt.hash(userInput.password, 12)

            // Create a new user
            const user = new User({
                email: userInput.email,
                firstName: userInput.firstName,
                lastName: userInput.lastName,
                password: hashedPw
            })

            // Store the new user in the database
            const createdUser = await user.save()

            /* 
                Return a createdUser object without all of the metadata Mongoose creates,
                and convert the _id to a string, otherwise it will fail
            */
            return {
                ...createdUser._doc,
                _id: createdUser._id.toString()
            }
        },

        updateUser: async (_, {userInput}, req) => {
        
            if (!req.isAuth) {
                const error = new Error('Not Authenticated')
                error.code = 401
                throw error
            }

            const user = await User.findById(req.userId)

            if (!user) {
                const error = new Error('No user found!')
                error.code = 401
                throw error
            }

            // Validation

            // Make a stack of errors
            const errors = []

            if (!validator.isEmail(userInput.email)) {
                errors.push({
                    message: 'Email is invalid.'
                })
            }

            if (validator.isEmpty(userInput.firstName)) {
                errors.push({ message: 'First name required.' })
            }

            if (validator.isEmpty(userInput.lastName)) {
                errors.push({ message: 'Last name required.' })
            }

            user = userInput

            const updatedUser = await user.save()

            return {
                ...updatedUser._doc,
                _id: updatedUser._id.toString()
            }
        },

        editProfile: async (_, { userInput }, { req, pubsub }) => {

            if (!req.isAuth) {
                const error = new Error('Not Authenticated')
                error.code = 401
                throw error
            }
            
            const id = userInput.id

            const user = await User.findById(id)

            if (!user) {
                const error = new Error('Unable to find user')
                error.code = 404
                throw error
            }

            user.firstName = userInput.firstName
            user.lastName = userInput.lastName
            user.bio = userInput.bio
            user.status = userInput.status

            await user.save()

            return {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
                status: user.status
            }
        },

        updateFollows: async (_, { id, followInput }, { req, pubsub }) => {

            if (!req.isAuth) {
                const error = new Error('Not Authenticated')
                error.code = 401
                throw error
            }

            const user = await User.findById(id)
            const user2 = await User.findById(followInput._id)

            if (!user) {
                const error = new Error('Unable to find user')
                error.code = 404
                throw error
            }

            if (!user2) {
                const error = new Error('Unable to find user2')
                error.code = 404
                throw error
            }

            if (followInput.action === 'add') {
                if (!user.following.find(el => el === user2._id)) {
                    // Update the follows of both users

                    user.following.push(followInput._id)
                    user2.followers.push(id)

                    await user.save()
                    await user2.save()
                } else {
                    const error = new Error(`already following ${user2.firstName}`)
                    error.code = 409
                    throw error
                }
                
                pubsub.publish(FOLLOWS_UPDATED, {
                    following: user.following
                })

                return {
                    
                    following: user.following
                }
            }

            if (followInput.action === 'remove') {
                // Remove the users from their respective follows arrays
                user.following.splice(user.following.indexOf(user2._id), 1)
                user2.followers.splice(user2.followers.indexOf(user._id), 1)

                await user.save()
                await user2.save()

                pubsub.publish(FOLLOWS_UPDATED, {
                    following: user.following
                })

                return {
                    following: user.following
                }
            }
        },

        login: async (_, { email, password }, { res }) => {

            const user = await User.findOne({ email: email })

            if (!user) {
                const error = new Error('User not found')
                error.code = 401
                throw error
            }

            const isEqual = await bcrypt.compare(password, user.password)

            if (!isEqual) {
                const error = new Error('Password is incorrect')
                error.code = 401
                throw error
            }

            const { accessToken, refreshToken } = createTokens(user)
           
            res.cookie('refreshToken', refreshToken, {
                expire: 60 * 60 * 24 * 7,
                httpOnly: true,
                // secure: true
            })
           
            res.cookie('accessToken', accessToken, {
                expire: 60 * 15,
                httpOnly: true,
                // secure: true
            })
           
            return {
                userId: user._id,
                accessToken,
                refreshToken  
            }
        },
        
        createPost: async (_, { postInput }, { pubsub, req }) => {
            // Check userId to see if the user is authenticated

            const creatorId = postInput.creatorId

            if (!req.isAuth) {
                const error = new Error('Not Authenticated')
                error.code = 401
                throw error
            }

            const errors = []
            if (validator.isEmpty(postInput.content)) {
                errors.push({ message: 'No content in post' })
            }
            if (errors.length > 0) {
                const error = new Error('Invalid input.')
                error.data = errors
                error.code = 422
                throw error
            }

            // Get the post's creator
            const user = await User.findById(creatorId)

            // If there is no user, something went wrong; throw an error
            if (!user) {
                const error = new Error('Invalid User')
                error.code = 401
                throw error
            }

            // If we have an authenticated user and valid input, create a new post
            const post = new Post({
                content: postInput.content,
                media: '',
                creator: user,
                replies: [],
                likes: []
            })

            const createdPost = await post.save()

            // Push the new post to the creating user's posts
            user.posts.push(createdPost)
            await user.save()

            // This should fire whenever a new post is triggered
            // Whenever we want the subscribe event triggered, call pubsub.publish.  
            // Two parameters for publish: <trigger name>, <payload>
            pubsub.publish(NEW_POST, {
                newPost: createdPost
            })

            return {
                ...createdPost._doc,
                _id: createdPost._id.toString(),
                createdAt: createdPost.createdAt.toISOString(),
                updatedAt: createdPost.updatedAt.toISOString()
            }
        },

        updatePost: async (_, { id, postInput }, { pubsub, req }) => {

            if (!req.isAuth) {
                const error = new Error('Not Authenticated')
                error.code = 401
                throw error
            }

            const userId = postInput.creatorId

            const post = await Post.findById(id).populate('creator')

            if (!post) {
                const error = new Error('No post found!')
                error.code = 401
                throw error
            }

            if (post.creator._id.toString() !== userId.toString()) {
                const error = new Error('Not authorized!')
                error.code = 403
                throw error
            }

            // Validation

            const errors = []
            if (validator.isEmpty(postInput.content)) {
                errors.push({ message: 'No content in post' })
            }

            if (errors.length > 0) {
                const error = new Error('Invalid input.')
                error.data = errors
                error.code = 422
                throw error
            }

            post.content = postInput.content

            const updatedPost = await post.save()

            // This should fire whenever a post is updated
            // Whenever we want the subscribe event triggered, call pubsub.publish.  
            // Two parameters for publish: <trigger name>, <payload>
            pubsub.publish(UPDATED_POST, {
                updatePost: updatedPost
            })

            return {
                ...updatedPost._doc,
                _id: updatedPost._id.toString(),
                createdAt: updatedPost.createdAt.toISOString(),
                updatedAt: updatedPost.updatedAt.toISOString()
            }
        },

        deleteOnePost: async (_, { id }, { req, pubsub }) => {

            if (!req.isAuth) {
                const error = new Error('Not Authenticated')
                error.code = 401
                throw error
            }

            const post = await Post.findById(id)

            if (!post) {
                const error = new Error('No post found!')
                error.code = 401
                throw error
            }

            if (post.creator.toString() !== req.userId.toString()) {
                const error = new Error('Not authorized!')
                error.code = 403
                throw error
            }

            await Post.findByIdAndRemove(id, { useFindAndModify: false })
            // Remove the post from the user's post list
            const user = await User.findById(req.userId)
            
            user.posts.splice(user.posts.indexOf(id), 1)

            await user.save()

            // This should fire whenever a post is deleted
            // Whenever we want the subscribe event triggered, call pubsub.publish.  
            // Two parameters for publish: <trigger name>, <payload>
            pubsub.publish(DELETED_POST, {
                id: id
            })

            return true
        }
    },

    Subscription: {        
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_POST) 
        },
        updatePost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(UPDATED_POST)
        },
        deletedPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(DELETED_POST)
        },
        followsUpdated: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(FOLLOWS_UPDATED)
        }
    }
}