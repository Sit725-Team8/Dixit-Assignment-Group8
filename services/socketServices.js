
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
        socket.on('joinRoom', data => {
            //get the number of user connected
            clientNo++;
            console.log(`Client No.${clientNo} is assign to a room`);
            //automate assign room to each user
            let room = 'room' + Math.ceil(clientNo / 4);
            console.log(room);
            //join room
            socket.join(room)
            //incase of use the room name in the server side
            //add the room into the array which store every user information in server side 
            userArray.forEach(element => {

                if (element.Id == data.userId) {
                    element.room = room
                    console.log(`room: ${element.room} added to user ${data.userName}`);
                }


            });
            //for the front end to sort the room name inside session
            io.to(room).emit('roomNumber', {
                room: room,
                playNo: clientNo
            })
            //if the room is full then start the game for that room
            if (clientNo % 4 === 0) {
                //clear the array for a new room
                let currentPlayer = []
                //incase of dot change the value in user array
                let newArray = JSON.parse(JSON.stringify(userArray))
                
                //get the current room
                let currentRoom = newArray[newArray.length - 1].room
                //an array to sort all player in this room

                //insert players
                newArray.forEach(element => {
                    if (element.room == currentRoom) {
                        element.storytellerNo=0
                        currentPlayer.push(element)
                        
                    } 
                });
                //make the first player in the array to be the storyteller
                currentPlayer[0].storytellerNo++;
                console.log('the current players are');
                console.log(currentPlayer[0].storytellerNo);
                console.log('the current player array is ');
                console.log(currentPlayer);
                
                //start game with the current players array so the client side can decide who's become story teller
                //all client should received the full array because in every interface should point out who is the storyteller
                //the propose is send whole array is because we may have many rooms in game at same time
                io.to(room).emit('startGame', currentPlayer)
            }
        })




    })





}



module.exports = {
    openSocket: socketIo,
    resultArray
}