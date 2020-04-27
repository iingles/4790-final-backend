import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
    },
    phone: {
        type: String,
        default: '000-000-0000'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Hi everyone!',
    },
    bio: {
        type: String,
        default: 'I haven\'t filled this out yet',
    },
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    backgroundImageUrl: {
        type: String
    },
    photoLg: {
        type: String
    },
    photoSm: {
        type: String
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
})

export const User = mongoose.model('User', userSchema)