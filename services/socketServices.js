

const userArray = require('./MongoService').userIdArray
const calFunction = require('./calculatorService').calculate
const assignCard = require('./assignCardService')
const passStoryteller = require('./storytellerService').passStoryteller

//an array store every player's respond from client side 
//so we can have mutiple game process at the same time
let inGameArray = []

let playerVoted = []



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

        /**
         * 
         * @param {[storyTeller:boolean,
         *          score: index,
         *          userName:user name(string)
         *          userId:userId(string)],
         *          room:room name(string),
         *          holdCard:card that belong to this user(index),
         *          message: theme(string)
         *          } data 
         */
        //get the message and card, user information from storyteller  
        socket.on('storyTheme', data => {


            inGameArray.push(data)
            let room = data.room
            //do not really need emit the whole data
            //the propose to have the whole data send by client is because will used for calculate result 
            //should change the socket name 
            io.to(room).emit('storyDisplay', data.message)
        })
        /**
         * 
         * @param {[
         *          userName:user name(string)
         *          userId:userId(string)],
         *          voteCard:card bring in this round(index),
         *          room: room name
         *          } data 
         */
        socket.on('vote', data => {
            playerVoted.push(data)
            let room = data.room;
            let i = 0
            playerVoted.forEach(element => {
                if (element.room == room) {
                    i++
                }
            });
            
            //all player has voted 
            if (i == 3) {
                let playersForARoom = []
                //push every player in that room to a array them send back to client side 
                //as this point all the players action finished so no worry about players to cheat
                inGameArray.forEach(element => {
                    if (element.room == room) {
                        playersForARoom.push(element)
                    }
                });
                playersForARoom.forEach(player => {
                    playerVoted.forEach(voted => {
                        if(player.userId == voted.userId){
                            player.voteCard = voted.voteCard
                        }
                    });
                });
                //then the result will calculated 
                let result = calFunction(playersForARoom)

                //the array to cal
                //send the result back to the client side 
                io.to(room).emit('showResult', result)
                console.log('the cal result is ' );
                console.log(result);
            }

        })
        socket.on('ChoiceCard',data=>{
            inGameArray.push(data)
            //foreach loop to get a room player
            let room = data.room;
            let i = 0
            inGameArray.forEach(element => {
                if (element.room == room) {
                    i++
                }
            });


            if(i == 4){
                let playersForARoom = []
                //push every player in that room to a array them send back to client side 
                //as this point all the players action finished so no worry about players to cheat
                inGameArray.forEach(element => {
                    if (element.room == room) {
                        playersForARoom.push(element)
                    }
                });
                io.to(room).emit('updateUI', playersForARoom)
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

                if (element.userId == data.userId) {
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
                        element.storytellerNo = 0
                        currentPlayer.push(element)

                    }
                });
                //make the first player in the array to be the storyteller
                currentPlayer[0].storytellerNo++;
                console.log('the current player array is ');
                console.log(currentPlayer);

                //start game with the current players array so the client side can decide who's become story teller
                //all client should received the full array because in every interface should point out who is the storyteller
                //the propose is send whole array is because we may have many rooms in game at same time
                io.to(room).emit('startGame', currentPlayer)
            }
        })
        

        /**
         * @param {userId, userName, storytellerNo} array
         */
        //listen to next round
        socket.on('nextRound', ({array, room})=>{
            array.forEach(element => {
                element.card = assignCard(assignCard.array)
            });
            passStoryteller(array,io,room)
            //when a game round if finished, should remove the data from array for next round
            let index = []
            inGameArray.forEach(element => {
                if(element.room == room){
                    index.push(inGameArray.indexOf(element))
                }
            });
            index.forEach(element => {
                inGameArray.splice(element,1)
            });
            let votedIndex = []
            playerVoted.forEach(element => {
                if(element.room == room){
                    votedIndex.push(playerVoted.indexOf(element))
                }
            });

            votedIndex.forEach(element => {
                playerVoted.splice(element,1)
            });
        })



    })





}



module.exports = {
    openSocket: socketIo
}