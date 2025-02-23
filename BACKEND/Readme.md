# YouTube Clone - Full Stack MERN

### Step 1: Data Modeling for the Project

* Data Model: Create a data model for the project. You can refer to the data model used for this project here: Link.

### Step 2: Install Node.js

* Install Node.js from the official website: Link.

* Initialize a Node.js project:
 `npm init -y`

### Step 3: Create a Public Folder

* Create a public folder in your project.

* Inside the public folder, create a temp folder and add a `.gitkeep` file so that the folder can be pushed to GitHub.

* Create a `.gitignore` file to ignore unnecessary files like node_modules, .env, etc.
<br> Use this tool to generate a .gitignore file: Gitignore Generator.

* Create a `.env` file to store sensitive information like ports, database URLs, etc.

### Step 3(a): Create a Src Folder

* Create a src folder in the root directory. Inside this folder, create the following files:

* `app.js` - Main application setup.

* `index.js` - Entry point of the application.

* `constants.js` - For constant values.

### Step 3(b): Two Types of Importing in JavaScript

* CommonJS (require): This is the older method and is the default in Node.js. No need to set "type": "module" in package.json.


```
const express = require('express');
const app = express();
```

* ES6 Modules (import): This is the modern method, mostly used in newer projects and browsers. Requires "type": "module" in package.json.


```
import express from 'express';
const app = express();
```

### Step 3(c): Install Nodemon

* Install nodemon to automatically restart the server when changes are made:
`npm i -D nodemon`

* Update the package.json file to include the following script:
```
"scripts": {
  "dev": "nodemon src/index.js"
}
```

### Step 4: Folder Structure in the Src Folder

* `controllers`: Handles business logic and HTTP request/response processing.

* `middleware`: Handles pre- or post-processing of requests, such as authentication, logging, error handling, etc.

* `db`: Manages database connections and configurations.

* `models`: Defines data structures (schemas) and interacts with the database.

* `routes`: Maps HTTP routes to corresponding controller actions.

* `utils`: Contains utility functions and helper methods used throughout the application.



### Step 4(a): Install Prettier

* Install Prettier to format your code:
```
npm i -D prettier
```
* Add the following files to the root directory:

* `.prettierrc` - Configuration for Prettier.

* `.prettierignore` - Files to ignore while formatting.


## Professional Backend Project Setup Complete! 🎉

### Step 1: Connect Database to the Project

* Use MongoDB Atlas to connect your database to the MERN project. MongoDB Atlas Link.

* After creating the database, get the database URL.
Example:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xyz.mongodb.net
```

### Step 2: Install Required Packages

* mongoose: For database connection.

* express: For setting up the server.

* dotenv: To load environment variables quickly.

### Step 3: Connect Database to the Project

* Write the database connection code in `src/db/index.js.`
```
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDB is connected !! DB Host : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error:", error)
        process.exit(1)
    }
}
export default connectDB;
```

* Import the connectDB function in `index.js` and use .then for the port and .catch for error handling.

* Add the following code to load environment variables in  index.js main wala its imp;
```
dotenv.config({
  path: "./.env",
});

//call the db from the mongodb
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running at port : http://localhost:${port}`)
    });
})
.catch((err)=>{
    console.log("MONGODB connection error in db/index.js",err);
})

```

### Step 4: Set Up Express in app.js

* Install the following packages:

* cookie-parser: To parse cookies.

* cors: To handle cross-origin requests.

* Add the following to your .env file:

`CORS_ORIGIN=*` // Allow any domain like Vercel, Netlify, etc. Example: https://xyz.vercel.com

* Configure middleware in app.js:

```
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
```


#### Middleware flow diagram
```
                                                (err, req, res, next)
     +--------------+ (middlewares)              +---------------+
     |              | +----+ +----+              |               |
     |  /instagram  | | MW | | MW |              |   res.send()  |
     |              | +----+ +----+              |               |
     +--------------+   |      |                 |               |
                        |      |                 +---------------+
                        |      |
                        |      |
                        |      v 
                        |       +------------------------+
                        |       |check if user is admin? |
                        |       +------------------------+
                        v        
                +-----------------------------+
                |check if user is logged in ? |
                +-----------------------------+
```

### Step 5: Create Utility Files

* `AsyncHandler.js`: A higher-order function to wrap async functions and handle errors automatically.

* `apiError.js`: To handle API errors consistently.[Documentation](https://nodejs.org/api/errors.html)

* `apiResponse.js`: To send consistent API responses.


### Step 6: Create User and Video Models

`User.model.js` : Handles user data, including password hashing using bcrypt and token generation using jsonwebtoken.

* Add the following to your .env file:

```
ACCESS_TOKEN_SECRET=  GENEREATE ANY RANDOME TOKEN
ACCESS_TOKEN_EXPIRY= 30d
REFRESH_TOKEN_SECRET= ENEREATE ANY RANDOME TOKEN
REFRESH_TOKEN_EXPIRY= 1d
```

`Video.model.js` : Handles video data, including file uploads using mongoose-aggregate-paginate.


### Step 7: File Upload Using Multer and Cloudinary

`Cloudinary`: For storing images and videos. Cloudinary Docs.

`Multer`: For handling file uploads. Multer Docs.

* Create a `cloudinary.js` file in the utils folder to handle Cloudinary configurations.


### Step 8: Multer Middleware

Create a `multer.middleware.js` in middleware file to handle file uploads. This middleware will be used wherever file uploads are required, such as during user registration or video uploads.

##  AFTER SETTING FILE UPLOAD, MIDDLEWARE, MODELS, UTILS, DB
#### NOW, WE MOVE FORWARD TO  WRITE CODE OF CONTROLLERS AND ROUTES FOR USER, VIDEOS, PLAYLIST, SUBSCRIPTIONS,POST, LIKE AND COMMENT

Ab hoga bas logic

### Step 1: Controller and Routes

* Create a file `(user,video,subscription,playlist,post,comment,like).controller.js` in the controllers folder.

* Create a file `(user,video,subscription,playlist,post,comment,like).routes.js` in the routes folder.

* After creating the all the routes, import them in app.js and declare them as middleware using app.use().

#### NOW CHECK IF THE POST METHOD IS WORKING IN POSTMAN!

### Step 2 {a} : User Logic Building :

* Register: Create user, hash password, generate tokens.
* Login: Verify password, generate tokens, send cookies.
* Logout: Clear cookies.
* Refresh Token: Generate new tokens if refresh token is valid.
* Change Password: Verify old password, hash and save new password.
* Get Profile: Fetch user details.
* Update Profile: Update username, email, avatar, or cover photo.
* Channel Profile: Fetch subscriber count and channel details.
* Watch History: Fetch videos with owner details using `$lookup`.

### Step 2 {b} : Video Controller Functions:

* Publish Video: Upload video and thumbnail to Cloudinary, save metadata.
* Get Videos: Fetch random published videos with pagination.
* Delete Video: Delete video from Cloudinary and database.
* Search Video: Search videos by title using `$regex`.
* Update Video: Update title, description, or thumbnail.
* Toggle Publish: Toggle `isPublished` status.

### Step 2 {c} : Subscription Controller Functions:

* Subscribe: Add subscription to channel.
* Unsubscribe: Remove subscription from channel using `$pull`.
* Subscriber Count: Count subscriptions for a channel.
* Get Subscriptions: Fetch channels user is subscribed to using `$lookup.`

### Step 2 {d} : Post Controller Functions:
* Add Post: Create post with optional image upload to Cloudinary.
* Get User Posts: Fetch posts by user ID.
* Update Post: Update post title, content, or image.
* Delete Post: Delete post from database.

### Step 2 {e} : Playlist Controller Functions:
* Create Playlist: Save playlist with name, description, and owner.
* Get User Playlists: Fetch playlists by user ID.
* Search Playlist: Search playlists by name or description using `$regex.`
* Get Playlist Videos: Fetch videos in a playlist using `$lookup`.

Add Video to Playlist: Add video ID to playlist's videos array.
* Remove Video: Remove video ID from playlist's videos array using `$pull`.
* Delete Playlist: Delete playlist from database.
* Update Playlist: Update playlist name or description.

### Step 2 {f} : Comment Controller Functions:
* Add Comment: Save comment and add to video's comments array.
* Get Comments: Fetch comments with owner details using `$lookup.`
* Delete Comment: Remove comment ID from video's comments array using `$pull`.
* Update Comment: Update comment text.

### Step 2 {g} : Like Controller Functions:

* Toggle Video Like: Add/remove like from video and user's likedvideos.
* Toggle Post Like: Add/remove like from post.
* Toggle Comment Like: Add/remove like from comment.
* Get Liked Videos: Fetch videos liked by user using `$lookup.`


### AFTER ALL THE CODE AND PASSING THEM IN THERE RELATIVE ROUTES 
```
#### WE WILL GET SEND THE API IN FORMAT:
```

### User Routes  
---

#### 1. **[GET]** `http://localhost:8000/api/v1/users/`  
- **Purpose**: Check if the User API is working.  

#### 2. **[POST]** `http://localhost:8000/api/v1/users/register`  
- **Purpose**: Register a new user.  
- **Middleware**:  
  - `upload.fields` for avatar and cover image upload.  

#### 3. **[POST]** `http://localhost:8000/api/v1/users/login`  
- **Purpose**: Log in a user.  


#### 4. **[POST]** `http://localhost:8000/api/v1/users/logout`  
- **Purpose**: Log out a user.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

#### 5. **[POST]** `http://localhost:8000/api/v1/users/refresh-Token`  
- **Purpose**: Refresh the access token.  

#### 6. **[POST]** `http://localhost:8000/api/v1/users/change-password`  
- **Purpose**: Change the user's password.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

#### 7. **[GET]** `http://localhost:8000/api/v1/users/current-user`  
- **Purpose**: Get the current user's profile.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

#### 8. **[PATCH]** `http://localhost:8000/api/v1/users/update-account`  
- **Purpose**: Update the user's account details (e.g., full name, email).  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

#### 9. **[PATCH]** `http://localhost:8000/api/v1/users/update-avatar`  
- **Purpose**: Update the user's avatar.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  
  - `upload.single` for avatar upload.  

#### 10. **[PATCH]** `http://localhost:8000/api/v1/users/update-coverimage`  
- **Purpose**: Update the user's cover image.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  
  - `upload.single` for cover image upload.  


#### 11. **[GET]** `http://localhost:8000/api/v1/users/c/:username`  
- **Purpose**: Get a user's channel profile.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


#### 12. **[GET]** `http://localhost:8000/api/v1/users/watch-history`  
- **Purpose**: Get the user's watch history.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


## Video Routes  

### 1. **[GET]** `http://localhost:8000/api/v1/videos/`  
- **Purpose**: Check if the Video API is working.  


### 2. **[GET]** `http://localhost:8000/api/v1/videos/homepage`  
- **Purpose**: Fetch random published videos for the homepage.  


### 3. **[GET]** `http://localhost:8000/api/v1/videos/results`  
- **Purpose**: Search videos by title.  

### 4. **[POST]** `http://localhost:8000/api/v1/videos/`  
- **Purpose**: Publish a new video.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  
  - `upload.fields` for video and thumbnail upload.  

### 5. **[DELETE]** `http://localhost:8000/api/v1/videos/:videoId`  
- **Purpose**: Delete a video.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


### 6. **[PUT]** `http://localhost:8000/api/v1/videos/:videoId`  
- **Purpose**: Update video details (title, description, thumbnail).  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  
  - `upload.single` for thumbnail upload.  


### 7. **[PATCH]** `http://localhost:8000/api/v1/videos/:videoId`  
- **Purpose**: Toggle the publish status of a video.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

  ## Subscription Routes  

### 1. **[POST]** `http://localhost:8000/api/v1/subscriptions/subscribe`  
- **Purpose**: Subscribe to a channel.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

### 2. **[DELETE]** `http://localhost:8000/api/v1/subscriptions/unsubscribe/:channelId`  
- **Purpose**: Unsubscribe from a channel.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

### 3. **[GET]** `http://localhost:8000/api/v1/subscriptions/subscribers/:channelId`  
- **Purpose**: Get the number of subscribers for a channel.  


### 4. **[GET]** `http://localhost:8000/api/v1/subscriptions/subscriptions`  
- **Purpose**: Get the list of channels the user is subscribed to.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


## Post Routes  

### 1. **[POST]** `http://localhost:8000/api/v1/posts/add`  
- **Purpose**: Add a new post.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  
  - `upload.single` for image upload.  


### 2. **[GET]** `http://localhost:8000/api/v1/posts/:id`  
- **Purpose**: Fetch all posts by a user.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


### 3. **[PUT]** `http://localhost:8000/api/v1/posts/:id`  
- **Purpose**: Update a post.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

### 4. **[DELETE]** `http://localhost:8000/api/v1/posts/:id`  
- **Purpose**: Delete a post.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

## Playlist Routes  

### 1. **[POST]** `http://localhost:8000/api/v1/playlists/`  
- **Purpose**: Create a new playlist.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


### 2. **[PATCH]** `http://localhost:8000/api/v1/playlists/:playlistId`  
- **Purpose**: Update a playlist.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


### 3. **[DELETE]** `http://localhost:8000/api/v1/playlists/:playlistId`  
- **Purpose**: Delete a playlist.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


### 4. **[GET]** `http://localhost:8000/api/v1/playlists/results`  
- **Purpose**: Search playlists by name or description.  


### 5. **[GET]** `http://localhost:8000/api/v1/playlists/:playlistId`  
- **Purpose**: Fetch all videos in a playlist.  


### 6. **[PATCH]** `http://localhost:8000/api/v1/playlists/add/:videoId/:playlistId`  
- **Purpose**: Add a video to a playlist.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


### 7. **[PATCH]** `http://localhost:8000/api/v1/playlists/remove/:playlistId/:videoId`  
- **Purpose**: Remove a video from a playlist.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

### 8. **[GET]** `http://localhost:8000/api/v1/playlists/feed/:userId`  
- **Purpose**: Fetch all playlists of a user.  


## Comment Routes  

### 1. **[POST]** `http://localhost:8000/api/v1/comments/:id`  
- **Purpose**: Add a comment to a video.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


### 2. **[DELETE]** `http://localhost:8000/api/v1/comments/:id`  
- **Purpose**: Delete a comment.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


### 3. **[PUT]** `http://localhost:8000/api/v1/comments/:id`  
- **Purpose**: Update a comment.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


### 4. **[GET]** `http://localhost:8000/api/v1/comments/:id`  
- **Purpose**: Fetch all comments on a video.  


## Like Routes  

### 1. **[POST]** `http://localhost:8000/api/v1/likes/video/:videoId`  
- **Purpose**: Toggle like on a video.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  


### 2. **[POST]** `http://localhost:8000/api/v1/likes/comment/:commentId`  
- **Purpose**: Toggle like on a comment.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

### 3. **[POST]** `http://localhost:8000/api/v1/likes/post/:postId`  
- **Purpose**: Toggle like on a post.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  

### 4. **[GET]** `http://localhost:8000/api/v1/likes/videos`  
- **Purpose**: Fetch all videos liked by the user.  
- **Middleware**:  
  - `verifyJWT` to ensure the user is authenticated.  



#### TABLE FORM OF API FOR FRONTEND:

## API Routes

### User Routes
| Method  | Endpoint                                      | Description                        |
|---------|----------------------------------------------|------------------------------------|
| GET     | `/api/v1/users/`                            | Check if the User API is working  |
| POST    | `/api/v1/users/register`                    | Register a new user               |
| POST    | `/api/v1/users/login`                       | Log in a user                     |
| POST    | `/api/v1/users/logout`                      | Log out a user                    |
| POST    | `/api/v1/users/refresh-Token`               | Refresh the access token          |
| POST    | `/api/v1/users/change-password`             | Change the user's password        |
| GET     | `/api/v1/users/current-user`                | Get the current user's profile    |
| PATCH   | `/api/v1/users/update-account`              | Update the user's account details |
| PATCH   | `/api/v1/users/update-avatar`               | Update the user's avatar          |
| PATCH   | `/api/v1/users/update-coverimage`          | Update the user's cover image     |
| GET     | `/api/v1/users/c/:username`                 | Get a user's channel profile      |
| GET     | `/api/v1/users/watch-history`               | Get the user's watch history      |

### Video Routes
| Method  | Endpoint                                      | Description                                |
|---------|----------------------------------------------|--------------------------------------------|
| GET     | `/api/v1/videos/`                           | Check if the Video API is working         |
| GET     | `/api/v1/videos/homepage`                  | Fetch random published videos             |
| GET     | `/api/v1/videos/results`                   | Search videos by title                    |
| POST    | `/api/v1/videos/`                          | Publish a new video                       |
| DELETE  | `/api/v1/videos/:videoId`                  | Delete a video                            |
| PUT     | `/api/v1/videos/:videoId`                  | Update video details                      |
| PATCH   | `/api/v1/videos/:videoId`                  | Toggle the publish status of a video      |

### Subscription Routes
| Method  | Endpoint                                      | Description                                  |
|---------|----------------------------------------------|----------------------------------------------|
| POST    | `/api/v1/subscriptions/subscribe`           | Subscribe to a channel                      |
| DELETE  | `/api/v1/subscriptions/unsubscribe/:channelId` | Unsubscribe from a channel              |
| GET     | `/api/v1/subscriptions/subscribers/:channelId` | Get the number of subscribers for a channel |
| GET     | `/api/v1/subscriptions/subscriptions`       | Get the list of subscribed channels         |

### Post Routes
| Method  | Endpoint                                      | Description                  |
|---------|----------------------------------------------|------------------------------|
| POST    | `/api/v1/posts/add`                         | Add a new post              |
| GET     | `/api/v1/posts/:id`                         | Fetch all posts by a user   |
| PUT     | `/api/v1/posts/:id`                         | Update a post              |
| DELETE  | `/api/v1/posts/:id`                         | Delete a post              |

### Playlist Routes
| Method  | Endpoint                                      | Description                          |
|---------|----------------------------------------------|--------------------------------------|
| POST    | `/api/v1/playlists/`                        | Create a new playlist              |
| PATCH   | `/api/v1/playlists/:playlistId`             | Update a playlist                  |
| DELETE  | `/api/v1/playlists/:playlistId`             | Delete a playlist                  |
| GET     | `/api/v1/playlists/results`                 | Search playlists                    |
| GET     | `/api/v1/playlists/:playlistId`            | Fetch all videos in a playlist      |
| PATCH   | `/api/v1/playlists/add/:videoId/:playlistId` | Add a video to a playlist        |
| PATCH   | `/api/v1/playlists/remove/:playlistId/:videoId` | Remove a video from a playlist  |
| GET     | `/api/v1/playlists/feed/:userId`           | Fetch all playlists of a user       |

### Comment Routes
| Method  | Endpoint                                      | Description                          |
|---------|----------------------------------------------|--------------------------------------|
| POST    | `/api/v1/comments/:id`                      | Add a comment to a video           |
| DELETE  | `/api/v1/comments/:id`                      | Delete a comment                   |
| PUT     | `/api/v1/comments/:id`                      | Update a comment                   |
| GET     | `/api/v1/comments/:id`                      | Fetch all comments on a video      |

### Like Routes
| Method  | Endpoint                                      | Description                          |
|---------|----------------------------------------------|--------------------------------------|
| POST    | `/api/v1/likes/video/:videoId`              | Toggle like on a video             |
| POST    | `/api/v1/likes/comment/:commentId`          | Toggle like on a comment           |
| POST    | `/api/v1/likes/post/:postId`                | Toggle like on a post              |
| GET     | `/api/v1/likes/videos`                      | Fetch all liked videos             |


#   THE END FROM THE BACKEND OF YOUTUBE 🎉
