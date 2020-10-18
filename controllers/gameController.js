// Start Socket implementation helpers  
const createRoom = (roomId, callback) =>{
    let newroom = {
        roomId: roomId,
        status: -1, // not active                
        players: [], // list of players 
        winner: 0 // winner Id 
    }
    callback(newroom);  
}

const getNumberOfPlayers = (room, callback) =>{   
    callback(room.players.length);  
}
const addPlayerToRoom = (room, playerName, socket, callback) =>{
    let newplayer = {
    room: room,     
    name: playerName,
    socket: socket,
    storyTold: 0,
    stories: [],
    score: 0
    }   
    callback(newplayer);  // update room
    }

module.exports = {
    createRoom,
    addPlayerToRoom,
    getNumberOfPlayers  
}