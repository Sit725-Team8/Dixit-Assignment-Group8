const { data } = require('jquery');
const cal = require('./calculatorService')
const userArray = require('./MongoService').userIdArray


let resultArray = []

//started the socket io
const socketIo = (io) => {
    //while a user connected 
    let clientNo = 0;
    io.on('connection', (socket) => {
        
        console.log('a user connected');
               
        //while user disconnected 
        socket.on('disconnect', () => {
            console.log('user disconnected');
        })
        //get the data from a user and then broadcast to all users 
        socket.on('test-socket', testData => {
            testData.card1 = 1
            console.log(testData);
            io.emit('test-socket', testData)
        })
        socket.on('send-result', data => {
            console.log(data);
            resultArray.push(data)
            //for test propose 
            if (resultArray.length == 4) {
                let array = cal.calculate(resultArray)
                console.log('test cal result');
                console.log(array);
            }
        })
        //listen to joint the room
        socket.on('joinRoom', data =>{
            //get the number of user connected
            clientNo++;
            console.log(`Client No.${clientNo} is assign to a room`);
            //automate assign room to each user
            let room = 'room'+Math.ceil(clientNo/4);
            console.log(room);
            //join room
            socket.join(room)
            //incase of use the room name in the server side
            //add the room into the array which store every user information in server side 
            userArray.forEach(element => {
            
                if (element.Id == data.userId){
                    element.room = room
                    console.log(`room: ${element.room} added to user ${data.userName}`);
                }
                
                
            });
            //for the front end to sort the room name inside session
            io.to(room).emit('roomNumber', {room:room,playNo:clientNo})
            //if the room is full then start the game for that room
            if(clientNo%4 === 0){
                //emit an event which star the game
                io.to(room).emit('startGame')
            }
        })

        


    })





}



module.exports = {
    openSocket: socketIo,
    resultArray
}