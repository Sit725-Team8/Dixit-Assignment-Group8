const MongoClient = require('mongodb').MongoClient;

//mongodb uri
//const uri = "mongodb+srv://ray:1998@cluster0.ho33k.mongodb.net/Sitboard?retryWrites=true&w=majority";
const uri = "mongodb://ray:1998@cluster0-shard-00-00.ho33k.mongodb.net:27017,cluster0-shard-00-01.ho33k.mongodb.net:27017,cluster0-shard-00-02.ho33k.mongodb.net:27017/assignment3?ssl=true&replicaSet=atlas-k8w5gq-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

// connect database 
try {
  // Connect to the MongoDB cluster
  await client.connect();
  // Make the appropriate DB calls
} catch (e) {
  console.error(e);
} finally {
  await client.close();
}

// a game object has {start_time, numberOfPlayers}
async function createAGame(client, _game){
  const result = await client.db("assignment3").collection("games").insertOne(_game);
  console.log(`New game has been initlized with the following id: ${result.insertedId}`);
  return result.insertedId; // return game Id. Can be saved as global var  
}

// a player object has {name}. 
async function addPlayer(client, _player){
  const result = await client.db("assignment3").collection("players").insertOne(_player);
  console.log(`A Player is added with following id: ${result.insertedId}`);
  return result.insertedId; // return player Id. Can be saved in active players list   

}

// add many players {name}. 
async function addPlayers(client, _players){
  const result = await client.db("assignment3").collection("players").insertMany(_player);
  console.log(`Players are added with following id: ${result.insertedIds}`);
  return result.insertedIds; // return list of player Ids. Can be saved in active players list   
}

// add player object to a game {player_id , game_id, order, color} 
// Order is number between 1:numberOfPlayers 
// will set score to 0 
// color is for highlight purpose
async function addPlayerToGame(client, _playerInGame){
  const result = await client.db("assignment3").collection("playerInGame").insertOne(_playerInGame);
  console.log(`A Player in game is added with following id: ${result.insertedId}`);
}

// search player in a game. 
// need player name and game id
async function findAPlayerInGame(client, _name, _game){
  const result = await client.db("assignment3").collection("playerInGame").insertOne(_playerInGame);
  console.log(`A Player in game is added with following id: ${result.insertedId}`);
}

// search a player by name. 
async function findAPlayer(client, {_name} = {}) {
  const cursor = await client.db("assignment3").collection("players")
  .find({
    name: { $gte: _name }
  })
  const results = await cursor.toArray();
}

// search a player by name. 
async function findAPlayerInGame(client, {_name, _game} = {}) {
  list_players_with_name = findAPlayer(client, _name);
}

// 
//connect to the database
let profileCollection
const openConnection = () => {
  client.connect(err => {
    profileCollection = client.db("assignment3").collection("userInfo");
    if (!err) {
      console.log('connected to the database assignment3-userInfo');
    }

  })
}

const insertProfile = (objectToInsert, res) => {
  profileCollection.insertOne(objectToInsert, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json({
        message: 'inserted',
        data: result
      })
    }
  })
}

const getProfile = (res) => {
  profileCollection.find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  }

  )
}



module.exports = {
  startDB: openConnection,
  insertProfile,
  getProfile
}