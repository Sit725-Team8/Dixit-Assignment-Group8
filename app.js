const express = require("express");
const bodyParser = require('body-parser');
const PORT = 3030
const services = require('./services')
const routers = require('./routes')

let app = new express();
app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json());

app.use('/createProfile', routers.creatProfile.createProfileRoute)

app.get('/result', (req,res)=>{
    mongo.getProfile(res);
    
})
//setup database
services.mongo.startDB()


app.listen(PORT,()=>{
    console.log('server started on port 3030')
})