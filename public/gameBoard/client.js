const socket = io.connect('http://localhost:3030')

let userId = sessionStorage.getItem('userId')
let userName = sessionStorage.getItem('userName')
let cards = sessionStorage.getItem('cards')

let payload = {
    userId: userId,
    userName: userName
}

//in case of send the user array back to server for next storyteller
//sort it here
let userInRoom = []

const findStoryteller = (array) => {
    for (let index = 0; index < array.length - 1; index++) {
        if (array[index].storytellerNo - array[index + 1].storytellerNo == 1) {

            return array[index]
        }

    }

}

$(document).ready(function () {
    console.log("user name:    ", sessionStorage.getItem('userName'));
    console.log("user id:    ", sessionStorage.getItem('userId'));
    console.log('user cards are');
    console.log(cards);


    socket.emit('joinRoom', payload)


});




//sort the room in the session in case of use that in future
socket.on('roomNumber', data => { //
    //set teh session 
    sessionStorage.setItem('room', data.room)
    let playerNo = data.playNo
    console.log(`the room is ${sessionStorage.getItem('room')}`);
    //check the number of player in the room
    let numberOfPlayerInRoom = playerNo % 4
    let waitNumberOfPlayer = 4 - numberOfPlayerInRoom
    //display in console
    console.log(`you are the No.${numberOfPlayerInRoom} in the room, will wait for ${waitNumberOfPlayer} to start the game `);

})
// //once received the start game event from server
socket.on('startGame', data => {
    /*ready to play
    //set cards
    //set storyteller
    if(storyteller == true){
        get theme and card
        socket.emit("storytellerChoice", {theme, card})
    }
    
     */
    //the storyteller has name and id to use

    //the information about storyteller
    let storyteller = findStoryteller(data)
    

    if (payload.userId == storyteller.Id) {
        console.log(`you are the story teller`);
        userInRoom = data;
        console.log('all user in room ');
        console.log(userInRoom);
        sessionStorage.setItem('storyteller', 'true')

    } else {
        console.log(`you are not the storyteller `);
        sessionStorage.setItem('storyteller', 'false')

    }


})