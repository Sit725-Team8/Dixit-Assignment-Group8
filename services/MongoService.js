const MongoClient = require('mongodb').MongoClient;

//mongodb uri
//const uri = "mongodb+srv://ray:1998@cluster0.ho33k.mongodb.net/Sitboard?retryWrites=true&w=majority";
const uri = "mongodb://ray:1998@cluster0-shard-00-00.ho33k.mongodb.net:27017,cluster0-shard-00-01.ho33k.mongodb.net:27017,cluster0-shard-00-02.ho33k.mongodb.net:27017/assignment3?ssl=true&replicaSet=atlas-k8w5gq-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})


let userIdArray = []
//connect to the database
let profileCollection
let roomCollection
// const openConnection = () => {
//   client.connect(err => {
//     profileCollection = client.db("assignment3").collection("userInfo");
//     if (!err) {
//       console.log('connected to the database assignment3-userInfo');
//     }

//   })
// }
const openConnection = () => {
  client.connect(err => {
    roomCollection = client.db("assignment3").collection("rooms");
    profileCollection = client.db("assignment3").collection("profiles");
    if (!err) {
      console.log('connected to the database assignment3');
      if (roomCollection == null) {
        client.db("assignment3").createCollection("profiles", function (err, res) {
          if (err) throw err;
          roomCollection = client.db("assignment3").collection("rooms");
          console.log("Room collection created!");
        });
      }

      if (profileCollection == null) {
        client.db("assignment3").createCollection("profiles", function (err, res) {
          if (err) throw err;
          profileCollection = client.db("assignment3").collection("profiles");
          console.log("Profiles collection created!");
        });
      }
    }
  })
}

// load game roo,s
const loadRooms = (callback) => {
  roomCollection.find({}).toArray(function(err, result) {
    if (err) throw err;
    callback(result);
  });   
}

//insert a game to the DB 
const insertRoom = (objectToInsert, callback) => { 
    roomCollection.insertOne(objectToInsert, (err, result) => {
        if (err) {
          console.log(err);
          return null;
        } else {
          console.log('Game room added: '+ result.insertedId);
          roomCollection.find({}).toArray(function(err, result) {
            if (err) throw err;     
            callback(result)       
          });    
         }
      })
    }  

  //find a game by Id
  const getRoomInfo = (room, callback) => {
    console.log('Search game _id: '+ room._id);
    roomCollection.findOne({ _id: room._id }, (err, result) => {
      if (err) { throw err }
      else {
        console.log('Found room room: '+ result);
        callback(result);
      }
    })
  }

  //find a game by Id
  const addPlayerToRoom = (room, player, callback) => { 
    var curr_players = []
    var params = {};

    if (room.players === undefined) {  // first player   
     curr_players.push(player.insertedId) 
     params['$set'] = { players: curr_players};   
     console.log(''+curr_players)
     console.log('empty...')
    }
    else {
      curr_players = room.players; 
      curr_players.push(player.insertedId) 
      console.log(''+curr_players)
      params['$set'] = { players: curr_players};
    }      

    var query = { _id: room._id }; 
    roomCollection.updateOne(query, params, function(err, res){
      if (err) {
        console.log(err);
      } else { 
        console.log(res.result.nModified); 
        callback(res.result.nModified);       
      }
    }) 
  }

  //insert the user data into database 
  const insertProfile = (playerObject, callback) => {
    profileCollection.insertOne(playerObject, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        userIdArray.push(result.insertedId)
        console.log('Player added..' + result.insertedId);
        console.log(userIdArray);
        callback(result);       
      }
    })
  }

  //find the user data 
  //not used for now 
  const getProfile = (player) => {
    console.log('Search player _id: '+ player._id);
    profileCollection.findOne({ _id: player._id}, (err, result) => {
      if (err) { throw err }
      else {
        console.log('Found player: '+ result);
        callback(result);
      }
    }) 
  } 
  module.exports = {
    startDB: openConnection,
    insertProfile,
    getProfile,
    userIdArray,
    insertRoom,
    getRoomInfo,
    loadRooms,
    addPlayerToRoom
  }