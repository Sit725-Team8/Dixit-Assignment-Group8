const MongoClient = require('mongodb').MongoClient;

//mongodb uri
//const uri = "mongodb+srv://ray:1998@cluster0.ho33k.mongodb.net/Sitboard?retryWrites=true&w=majority";
const uri = "mongodb://ray:1998@cluster0-shard-00-00.ho33k.mongodb.net:27017,cluster0-shard-00-01.ho33k.mongodb.net:27017,cluster0-shard-00-02.ho33k.mongodb.net:27017/assignment3?ssl=true&replicaSet=atlas-k8w5gq-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})


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