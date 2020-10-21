const MongoClient = require('mongodb').MongoClient;

//mongodb uri
//const uri = "mongodb+srv://ray:1998@cluster0.ho33k.mongodb.net/assignment3?retryWrites=true&w=majority";
const uri = "mongodb://ray:1998@cluster0-shard-00-00.ho33k.mongodb.net:27017,cluster0-shard-00-01.ho33k.mongodb.net:27017,cluster0-shard-00-02.ho33k.mongodb.net:27017/assignment3?ssl=true&replicaSet=atlas-k8w5gq-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

let userIdArray=[]

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

//insert the user data into database 
const insertProfile = (objectToInsert, res) => {
  profileCollection.insertOne(objectToInsert, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let payload = {
        Id:objectToInsert._id,
        name:objectToInsert.name,
        storytellerNo:0
      }
      console.log(payload);
      userIdArray.push(payload)
      console.log('the users array is ');
      console.log(userIdArray);
      res.json(payload)
    }
  })
}

//find the user data 
//not used for now 
const getProfile = (res) => {
  profileCollection.find().toArray((err,result)=>{
    if(err) {throw err}
    else{
      res.send(result)
    }
  }
 )
}



module.exports = {
  startDB: openConnection,
  insertProfile,
  getProfile,
  userIdArray
}