const socket = io.connect('http://localhost:3030')

let userId = sessionStorage.getItem('userId')
let userName = sessionStorage.getItem('userName')

let payload = {
    'senderId': userId,
    'senderName': userName
}

//setTimeout(() => {
$( document ).ready(function() {
    console.log( "user name:    ",sessionStorage.getItem('userName'));
    console.log("user id:    ", sessionStorage.getItem('userId'));
    socket.emit('joinRoom', payload)




});

//needs to be replaced
function message(msg) {

    alert(msg)

}

//sort the room in the session in case of use that in future
socket.on('roomNumber', data => { //
    //set teh session 
    sessionStorage.setItem('room', data.room)
    let playerNo = data.playNo
    console.log(`the room is ${sessionStorage.getItem('room')}`);
    //check the number of player in the room
    let numberOfPlayerInRoom = playerNo%4
    let waitNumberOfPlayer = 4- numberOfPlayerInRoom
    //display in console
    let waitMessage = (`you are the No. ${numberOfPlayerInRoom} in the room, will wait for ${waitNumberOfPlayer} to start the game `);
    message(waitMessage)
    
})
// //once received the start game event from server
socket.on('startGame', data=>{
    message()
    /*ready to play
    //set cards
    //set storyteller
    if(storyteller == true){
        get theme and card
        socket.emit("storytellerChoice", {theme, card})
    }

     */

 })