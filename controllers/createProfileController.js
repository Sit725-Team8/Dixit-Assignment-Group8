const database = require('../services/MongoService');

const addPlayer=(payload, res)=>{
    database.insertProfile(payload,res);
}

const displayPlayers=(res)=>{
    database.getProfile(res);
}

module.exports={
    addPlayer,
    displayPlayers
}