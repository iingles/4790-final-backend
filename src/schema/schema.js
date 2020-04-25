import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type Post {
        _id: ID!
        content: String!
        imageUrl: String
        creator: User!
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
        followers: [User!]!
        following: [User!]!
        birthday: String
        status: String 
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
        email: String!
        firstName: String!
        lastName: String!
        password: String!
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
        updateFollows(id: ID!, followInput: followData): User!
        updateUser(id: ID!, userInput: UserInputData): User!
        updatePost(id: ID!, postInput: PostInputData): Post!
        deleteOnePost(id: ID!): Boolean        
    }

    type Subscription {
        newPost: Post!
        updatePost: Post!
        deletedPost: Post
    }
`