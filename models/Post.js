import mongoose from 'mongoose'

const Schema = mongoose.Schema

const postSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    media: {
        type: String,
        required: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
    //Pass an object as a second argument to the Schema constructor
}, {
    timestamps: true
})

export const Post = mongoose.model('Post', postSchema)