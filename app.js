const express = require("express");
const bodyParser = require('body-parser');
let app = new express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const PORT = 3030
const services = require('./services')
const routers = require('./routes');


app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json());

app.use('/createProfile', routers.creatProfile.createProfileRoute)

services.socket.openSocket(io)

//setup database
services.mongo.startDB()


http.listen(PORT,()=>{
    console.log('server started on port 3030')
})