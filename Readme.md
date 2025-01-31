# YouTube clone Full stack MERN


**Step : 1** :
Make a data modelling for the project 

**Data model used for project:**   [   Link]( https://app.eraser.io/workspace/09VGBNSaiaIbGgolw42y?origin=share)

**Step : 2** " Install the package [Link](https://www.npmjs.com/)

Initialize Node.js project 
* npm init -y


**Step : 3**  : Make a public folder

In this folder we will make a temp folder and inside that folder we made .gitkeep so we can push on github.
Also we make  a .gitignore file where we put file we need to ignore like nodemodules , .env , etc **Use a tool to make gitignore file.**[Link](https://mrkandreev.name/snippets/gitignore-generator/#Node)

After this we make a .env file where we add sensitive files like ports, database url etc.

**Step:3(a)** : Make a src folder on root

Make three files 
1. app.js 
2. index.js
3. constants.js


**Two Types of Importing in JavaScript**

1️ . CommonJS (require) :This is the older method and is the default in Node.js.No need to set ( "type": "module" ) in package.json.

``` 
const express = require('express'); 
const app = express();
```

2 . ES6 Modules (import) :This is the modern method, mostly used in newer projects and browsers.Requires ( **"type": "module"** ) in package.json.

```
import express from 'express';
const app = express();
```

**Step: 3(b)** : Install nodemon for auto restart server when we make any change in code.
**npm i -D nodemon**

After that make change in package.json
```
"scripts": {
    "dev": "nodemon src/index.js"
  },
```

**Step : 4** : Make folder structure in src folder


* **controllers** : Yeh folder business logic aur HTTP request/response processing handle karta hai.

* middleware : Yeh folder request processing ke beech mein code run karta hai, jaise authentication, logging, error handling, etc., jo requests ko process karne ke liye pre or post controller ke liye hota hai.

* **db** : Yeh folder database connection aur uske configurations manage karta hai.

* **models** : Yeh folder data structure (schemas) define karta hai aur database ke saath interact karta hai.

* **routes** : Yeh folder HTTP routes ko corresponding controller actions ke saath map karta hai.

* **utils** : Yeh folder utility functions aur helper methods rakhta hai jo application ke har jagah use hote hain.


#### After this install prettier which is used to format code **npm i -D prettier**
After this add two file in main
1. .prettierrc : 
2. .prettierignore :


## Here we completed the setup professional backend project format.


**Step : 1** : NOW CONNECT DATABSE INTO YOUR PROJECT

Use mogodb atlas for the connection database to the mern project  [Link](https://cloud.mongodb.com/v2/679724dd29d2e939ac3bf5b0#/clusters)

 After making database get database url link.

 #### Example: MONGODB_URI=mongodb+srv://(database-name): (database-password)@cluster0.3kmkv.mongodb.net

 **Step : 2** : Some packages 
 * **mongoose** : for database connection
 * **express** : for port connection
 * **dotenv** : is used for (jitni jaldi ho sakte saare env variable load hojaye in main file)


Step : 3 : Connect database from atals to db file using index.js

Code is written in <u> src/db/index.js </u>

Fhir connectDB file ko index.js mai as a function put kardinge and usme .then mai port and .catch mai error after that dotenv ko import karke ye code likh dinge
``` 
dotenv.config({
    path: "./.env",
}) 
```

#### Step : 4 : Connect express in app.js

Install two packages here:
* **cookie-parser** : cookie ko kaise parse karte hai
* **cors** : cors is used for ...

and env mai `CORS_ORIGIN=* // any domain like vercel, netlify, etc example: https://xyz.vercel.com` likh dinge.

After that Import both in app.js.
`app.use(cors()) (middleware configuration ke liye use mai aata hai)`

Ab data kaafi jagha se aayega uski prepration chal rahi hai url se bhi data aayega , kuch json mai bhi, kuch req body mai bhi honge form wagera mai, file wagera, pdf .
Toh iske liye hum limit lagate hai using middleware 
* `app.use(express.json())`
* `app.use(express.urlencoded())`
* `app.use(express.static())`
* `app.use(cookieparser())`

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

### Step : 5 : Now make asyncHandler , apiError and aprRsponse in utils
1. `AsyncHandler.js`
 
 * **Kya karta hai?**
Yeh ek higher-order function hai jo async functions ko wrap karta hai taki har request ke errors automatically handle ho jayein.
* **Kahan use hoga?**
Jab bhi tum async middleware ya controllers likhoge, wahan ye try-catch likhne ki zaroorat khatam karega.
* **Kaise help karega?** 
Har route handler ke andar try-catch likhne se bachoge.
Agar kisi bhi async function me error aata hai, toh wo automatically Express ke error middleware ko pass ho jayega. 

2. `apiError.js` [Documentation](https://nodejs.org/api/errors.html)
* **Kya karta hai?**
Yeh ek higher-order function hai jo async functions ko wrap karta hai taki har request ke errors automatically handle ho jayein.
* **Kahan use hoga?**
Jab bhi tum async middleware ya controllers likhoge, wahan ye try-catch likhne ki zaroorat khatam karega.
* **Kaise help karega?**
Har route handler ke andar try-catch likhne se bachoge.
Agar kisi bhi async function me error aata hai, toh wo automatically Express ke error middleware ko pass ho jayega.

3. `apiResponse.js`
* **Kya karta hai?**
Yeh ek common response structure provide karta hai taki har API response ek consistent format me ho.
* **Kahan use hoga?**
Har jagah jahan tum API se response bhej rahe ho, chahe wo data ho ya message.
* **Kaise help karega?**
Tumhare API responses uniform rahenge (har API success/failure ka same structure hoga).
Frontend ko easy parsing aur debugging me madad milegi, kyunki har response ek standard format follow karega.

### Step : 6 : Make user and video models in models folder
1.`User.model.js` : 
Yeh ek Mongoose model hai jo user collection se data access karta hai.

isme we used `bcrypt and jwt(jasonwebtoken)`
* **bcrypt**: it just help to hash your password
* **jwt**: it help to generate token for user

jwt ke liye kuch keys chahiye so wo hum env file mai bana dine as:
* ACCESS_TOKEN_SECRET=
* ACCESS_TOKEN_EXPIRY=
* REFRESH_TOKEN_SECRET=
* REFRESH_TOKEN_EXPIRY=



2.`Video.model.js` :
Yeh ek Mongoose model hai jo video collection se data access karta hai.

isme we used `mongoose-aggrigatepeginate` for ...


### Step : 7 : File handling and uploading using multer and cloudinary

* [Cloudinary](https://console.cloudinary.com/pm/c-616947f1e6c0ef1a3346f68fed7b6f/getting-started) : npm i cloudinary ( Image wagera save karta hai )
* [Multer](https://github.com/expressjs/multer) : npm i multer ( File ko upload karne mai help karta hai user se )


`Cloudinary.js` file banegi in utils jaghga saara code hoga.


### Step : 8 : Make a middleware using multer
`multer.middleware.js`<br>
As a middleware kyuki as jaarahe ho toh merse milke jaana .<br>
jagha jagha file upload ki capability use hogi waha waha multer middleware inejct hoga like _registration_.

## AFTER SETTING FILE UPLOAD, MIDDLEWARE, MODELS, UTILS, DB.<br> 
### NOW, WE MOVE FORWARD FOR CONTROLLERS AND ROUTES.
### Ab hoga bs logic logic logic

## Step : 1 : Controller and routes
Make a file `user.controller.js` in controller folder <br>
Make a file `user.routes.js` in routes folder

After making user route import the routes in `app.js` and declare it as a middlerware _app.use_


**NOW CHECK THE POST METHOD IS WORKING IN POSTMAN OR NOT !** 

### Step : 2{a} : Logic building | user register

`user.controller.js`

All the logic are in the form of steps are in the code. 
So check code carefully.

### use postman to check if the user.controller.js is working or not proparly 
[Use this reference link from YT](https://youtu.be/_u-WgSN5ymU?si=XOFeEyW005MipNIu)

### Step : 2{b} : Logic building | user login

`user.controller.js`

All the logic are in the form of steps present in the code.
So check code carefully.

We also send cookies with tokens while logging
using _res.cookie()_

### Step : 2{c} : Logic building | user logout

`user.controller.js`

Make a middleware `auth.middleqware.js` <br>
Humne ek middleware banaya hai jo JWT (access token) ko verify karta hai. Agar token valid hai, toh user ki details request mein attach karke next step ko call karta hai; agar token invalid hai, toh error throw karta hai.

Uske baad `user.router.js` mai middleware verifyJWT call hoga and logoutuser . fhir logout hoga .

isme cookies clear hogi _res.clearCookie()_ and logout response hoga.

### Step : 2{d} : accesstoken and refreshtoken genration after expring

toh jab refreshtoken expire hoga tab frontend mai ek refreshtoken se hum refreshtoken ko backend se match karke ek new refreshtoken dinge 
as incoming refesh token jo user ne diya match with stored refreshtoken  `incomingrefreshToken !== user?.refreshToken` 
match hoga toh new genereateAccessAndRefereshTokens banega.

### Step : 3 : add subscription model 

Make a file `subscription.model.js` in models folder


