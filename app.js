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

app.get('/result', (req,res)=>{
    services.mongo.getProfile(res) 
})
app.get('/game', (req,res)=>{
    res.sendfile('./public/gameBoard/gameBoard.html') 
})
//setup database
services.mongo.startDB()


http.listen(PORT,()=>{
    console.log('server started on port 3030')
})