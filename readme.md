# Isaac's Twitter Clone
#### Final Project for DGM 4790, Spring 2020

[My Twitter Clone GraphQL](http://206.189.215.72/) 

and

[My Twitter Clone Prototype REST API](http://206.189.215.72/)

Are both hosted live on DigitalOcean.
---

## Project Requirements
1. Effectively use conditional logic, JavaScript array methods, and front-end framework elements to render large lists on the web client.

1. Work with the proper tools (e.g. VueJS, React) to create and manage the front-end portion of your project within a real development toolset.
    - [x] Front End Repository is located [here](https://github.com/iingles/4790-final-frontend)

1. Work with NPM and NodeJS to create and manage the back-end portion of your project.
    - [x] Project was built with Node, Express, Apollo Server, and various other NPM packages.  See [package.json](https://github.com/iingles/4790-final-backend/blob/master/package.json) for a list of NPM dependencies.
1. "Seed" script provides way to populate the datastore after the Docker install and launch.
    - [x] Seed script is written to seed a MongoDB instance and is located [here](https://github.com/iingles/4790-final-backend/blob/master/data/seed.js), and can be run with 
    
    `npm run seed`  
    
    **Be sure to update the connection string in the script if you intend on running it on your own instance of MongoDB.**

1. Properly use Git for your source version control with an established record of at least 4 days of commits each week from February 19th through April 27th.
    - [x] See my [Github Profile](https://github.com/iingles)

1. Present a User Interface route or "page" that allows the user to:
     **The original mono-repo for my REST project is** [here](https://github.com/iingles/node-social)     

    - Here are the relevant parts of the REST backend:
    [REST controllers](https://github.com/iingles/node-social/tree/master/backend/controllers)
    [REST routes](https://github.com/iingles/node-social/tree/master/backend/routes)

    - Here's where most of the action happens on the REST front end:
    [Feed view](https://github.com/iingles/node-social/blob/master/frontend/src/views/Feed.vue)
    [Profile view](https://github.com/iingles/node-social/blob/master/frontend/src/views/Profile.vue)

    1. CREATE a meaningful (at least 5 data fields) resource through a REST endpoint that is stored in the datastore
        - [x] You can sign up a user with email, firstname, lastname, and password 
        - [x] You can create new posts

    1. Read or GET meaningful data from 3 different REST endpoints
        - [x] Posts are fetched on the loading of the main feed screen as well as the profile screen
        - [x] User data is fetched along with the posts
        - [x] User data is fetched on the profile page
        - [x] User data is fetched on login

    1. UPDATE at least 1 portion of meaningful data through the appropriate endpoint
        - [x] Posts may be updated

    1. DELETE some resource via the proper endpoint
        - [x] Posts may be deleted 

1. Present a separate User Interface route or "page" that allows the user to:
    1. CREATE a meaningful (at least 5 data fields) resource through a GraphQL endpoint that is stored in the datastore
        - [x] A user may be signed up on the [/signup](http://206.189.215.72/signup) page.

    2. Read or GET meaningful data from with at least 3 different query options from the GraphQL endpoint.
        - [x] A user may login on the [/login](http://206.189.215.72/login) page. *Demo users have been provided*
        - [x] Posts are loaded in the **Home** view with the Vue `created()` hook.
        - [x] User data is loaded into each individual post as it is rendered.
        - [x] User data is loaded in the **Profile** view with the Vue `created()` hook. 

    3. UPDATE at least 1 portion of meaningful data through an appropriate GraphQL mutation.
        
        - [x] Once logged in, a user may edit their profile by clicking on the **profile** link in the main nav menu.
        - [x] Once logged in, a user may edit any posts that *they* have created by clicking on the top right menu of the individual post.

        ### I have not gotten the following two items to update in real time, and they require a page reload to see the results:

        - [x] A user may "follow" or "unfollow" other users by clicking on the "follow/unfollow" button on the user's profile.
        - [x] A user may "like" a post by clicking on the heart icon.

    1. DELETE some resource using a proper GraphQL mutation.
        - [x] Once logged in, a user may delete a post that *they* have created by clicking on the top right menu of the individual post.

    1. You will submit the GitHub URL for your project with a detailed ReadMe explaining how to install and run your server(s) on Docker

        - [x] My MongoDB database is running in a Docker container on DigitalOcean.  



    ## Additional Information:    

   
    - [x] The backend GraphQL playground may be reached [here](http://206.189.215.72:4000/graphql), although the app requires authentication so you won't (or at least shouldn't) be able to do much.
    - [x] GraphQL resolvers for CRUD operations are [here](https://github.com/iingles/4790-final-backend/blob/master/src/resolvers/resolvers.js)
    - [x] GraphQL Schema is [here](https://github.com/iingles/4790-final-backend/blob/master/src/schema/schema.js)

        
 

