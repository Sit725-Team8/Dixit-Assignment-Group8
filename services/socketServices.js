const cal = require('./calculatorService')
const userArray = require('./MongoService').userIdArray
const gameController = require('../controllers/gameController');

let resultArray = []
var rooms = []
//started the socket io
const socketIo = (io) => {
    //while a user connected 
    io.on('connection', (socket) => {
        console.log('a user connected');
        console.log(userArray.length);
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

        io.emit('hello', 'hello')

        socket.on('join', function (player) {
            roomNames = Object.keys(socket.rooms);
            console.log('Rooms: ' + roomNames)


            socket.username = player.playerName;
            numRooms = rooms.length;
            if (numRooms == 0) {
                let roomId = 0;
                if (Object.keys(socket.rooms).length > 0) { // check the default room
                    roomId = Object.keys(socket.rooms)[0];
                } else
                    roomId = 'room' + (numRooms + 1);

                gameController.createRoom(roomId, function (newRoom) { // create a room object.
                    socket.room = roomId;
                    gameController.addPlayerToRoom(newRoom.roomId, player.playerName, socket, function (newplayer) {
                        newRoom.players.push(newplayer);
                        rooms.push(newRoom);
                        socket.join(socket.room);
                        socket.emit('join', {msg: socket.room, count: 3});
                        socket.to(socket.room).emit('addplayer', {msg: 'New player ' + player.playerName + ' joined', count: 3}); // inform others on the room   
                        // socket.emit('join', {room: socket.room, count: 1});
                        // socket.to(socket.room).emit('addplayer', 'New player ' + player.playerName + ' joined'); // infrom others on the room 

                    })
                })
            } else { // try to add player to the last created room
                let currentRoom = rooms[rooms.length - 1];
                gameController.getNumberOfPlayers(currentRoom, function (numOfPlayers) {
                    if (numOfPlayers < 4) {
                        gameController.addPlayerToRoom(currentRoom.roomId, player.playerName, socket, function (newplayer) {
                            currentRoom.players.push(newplayer);
                            socket.room = currentRoom.roomId;
                            socket.join(socket.room);
                            socket.emit('join', {msg: socket.room, count: 3 - numOfPlayers});
                            socket.to(socket.room).emit('addplayer', {msg: 'New player ' + player.playerName + ' joined', count: 3 - numOfPlayers}); // inform others on the room 
                            gameController.roomIsFull(currentRoom, function(isFull, playersCount){
                                console.log('#players = ' +playersCount)
                                if(isFull) {
                                    socket.emit('startGame', {msg: 'game will be started in seconds....', count: 4}); // inform others on the room
                                    socket.to(socket.room).emit('startGame', {msg: 'game will be started in seconds....', count: 4}); // inform others on the room
                                }
                            })           
                        })
                    } else { // create a new room 
                        let roomId = 'room' + (numRooms + 1);
                        gameController.createRoom(roomId, function (newRoom) {
                            socket.room = roomId;
                            gameController.addPlayerToRoom(newRoom.roomId, player.playerName, socket, function (newplayer) {
                                newRoom.players.push(newplayer);
                                rooms.push(newRoom);
                                socket.join(socket.room);
                                socket.emit('join', socket.room);
                                socket.to(socket.room).emit('addplayer', 'New player ' + player.playerName + ' joined'); // inform others on the room 
                            })
                        })
                    }
                });
            }
        });


    })





}



module.exports = {
    openSocket: socketIo,
    resultArray
}