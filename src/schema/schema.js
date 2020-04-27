import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type Post {
        _id: ID!
        content: String!
        media: String!
        creator: User!
        replies: [Post!]!
        likes: [User!]!
        createdAt: String!
        updatedAt: String!
    }    

    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        posts: [Post!]
        photoSm: String
        photoLg: String
        bio: String
        followers: [User!]
        following: [User!]
        birthday: String
        status: String
        backgroundImageUrl: String
    }

    type AuthData {
        refreshToken: String!
        userId: String!
        accessToken: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    input UserInputData {
        id: ID
        email: String!
        firstName: String!
        lastName: String!
        password: String
        photoSm: String
        photoLg: String
        backgroundImageUrl: String
        bio: String
        birthday: String
        status: String
    }

    input followData {
        _id: ID!
        action: String!
    }

    input PostInputData {
        content: String!
        creatorId: String!
        media: String
    }

    input likeData {
        _id: ID!
        action: String!
    }

    type Query {        
        getUser(_id: String!): User!
        posts(page: Int): PostData!
        user: User!
    }
    
    type Mutation {
        login(email: String!, password: String!): AuthData!
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        editProfile(userInput: UserInputData): User!
        updateFollows(id: ID!, followInput: followData): User!
        updateUser(id: ID!, userInput: UserInputData): User!
        updatePost(id: ID!, postInput: PostInputData): Post!
        deleteOnePost(id: String!): String!
    }

    type Subscription {
        newPost: Post!
        updatePost: Post!
        deletedPost: String!
        followsUpdated: User!
    }
`