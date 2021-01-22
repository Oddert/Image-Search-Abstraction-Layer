# Image-Search-Abstraction-Layer

An image searcher built for the FreeCodeCamp backend challenge

## Live Demo
[https://foam-eye.glitch.me/](https://foam-eye.glitch.me/)

## Installation
You will need to setup a mongodb server and connect it via an .env file
```
$ git clone https://github.com/Oddert/Image-Search-Abstraction-Layer.git
$ cd Image-Search-Abstraction-Layer
$ npm i
```
### For development
```
$ npm run dev
```
### For a production build
```
$ npm start
```

## Scripts
| script | command                                        | action
|--------|------------------------------------------------|------------------------------------------------|
| start  | node app.js                                    | runs the server                                |
| server | nodemon app.js                                 | runs the server with auto restart              |

# Routes
| Route  | Params | Returns
|--------|-------------|-------------------|
| /  |  | returns a basic html page to interact with the API |
| /api/search/:serach_term | String representing a query for the image api | JSON object with detials of the image entry |
| /api/search_logs  |  | returns the logs of past searches |
