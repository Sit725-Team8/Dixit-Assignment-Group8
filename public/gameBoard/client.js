const socket = io.connect('http://localhost:3030')

let userId = sessionStorage.getItem('userId')
let userName = sessionStorage.getItem('userName')
let rawcards = sessionStorage.getItem('cards')
let cards = rawcards.split(",").map(Number);
let score = sessionStorage.getItem('score')

let payload = {
    userId: userId,
    userName: userName
}
let storyteller;

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
function mapCard(cardsIndex){
    let deckPath = "dixitCards/"
    let card = deckPath.concat(cardsIndex)
    card = card.concat(".PNG")
    console.log("card:   ", cardsIndex)
    console.log("card path:   ", card)
    return card
}

$(document).ready(function () {
    console.log("user name:    ", sessionStorage.getItem('userName'));
    console.log("user id:    ", sessionStorage.getItem('userId'));
    console.log("score is :    ", sessionStorage.getItem('score'));
    console.log('user cards are');
    console.log(cards);
    console.log(cards[0]);
    console.log(cards[1]);
    console.log(cards[2]);
    console.log(cards[3]);
    console.log(cards[4]);
    console.log(cards[5]);
    console.log(cards[6]);
    console.log("lenght of cards:   ", cards.length)



    document.getElementById("p1c1").src = mapCard(cards[0])
    document.getElementById("p1c2").src = mapCard(cards[1])
    document.getElementById("p1c3").src = mapCard(cards[2])
    document.getElementById("p1c4").src = mapCard(cards[3])
    document.getElementById("p1c5").src = mapCard(cards[4])
    document.getElementById("p1c6").src = mapCard(cards[5])





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

/**
 *  data = { [Id:id,
 *            name:username,
 *            storytellerNo:integer]}
 */
// //once received the start game event from server
socket.on('startGame', data=>{
    alert("found players")

     //the information about storyteller
     storyteller = findStoryteller(data)
    

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


//when receiving info from storyteller
//let selectedCards = []

//emit story to server first, the server record the story and then will emit back to socket 'storyTheme'(should be a io.to.emit)
//because all players has to see the story.

socket.on("storyTheme", data => {
    //*add html element to show theme to UI
    $("#theme").text(data.theme)
    storytellerCard= data.card
    alert("select a card that matches the theme")
    //$(#playercard).onclick() -> save card
    //$(#selectBtn).onclick() -> selectedCards.push({player, card})  ->socket.emit("similarCard", {card, player})
})
//when a player select 


//if we listen the socket from server side
//the guess array should generate on server side 
//the data would be the array send from server side

//then the logic should also write in the server side 
//such as 
//when player pick a card, emit to server side
//the sever side say if length == 4 then emit that array to 'similarCard' socket

socket.on("similarCard", data => {//careful of data order
    //the data should be the guess array and just notice users
    //such as alter etc...

})


//vote should also be a function 
//maybe this function should in the socket similarCard, because the data is the full array of cards bring out
//inside the function, it has to emit to server with the card selected(maybe with your cards in case of calculate the score)
const vote = ()=>{

}

//the button for send cards that storyteller. 
const storytellerChoiceCard = ()=>{
    let storyCard  //should be a index that
    
}







