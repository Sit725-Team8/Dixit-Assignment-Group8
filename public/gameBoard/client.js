const socket = io.connect('http://localhost:3030')

let userId = sessionStorage.getItem('userId')
let userName = sessionStorage.getItem('userName')
let storytellerCard;
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
    //if not player 4
    alert(msg)
    //else nothing

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
    message("found players, please close all alerts")
    $("#p1c1").src( "assets/DixitCards/", cards[0], ".PNG")
    $("#p1c2").src("assets/DixitCards/", cards[1], ".PNG")
    $("#p1c3").src("assets/DixitCards/", cards[2], ".PNG")


    /*ready to play
    //set cards
    //set storyteller

     */
    if(storyteller == true){
        let theme = prompt("enter a theme that suits one of your cards and then select the card")
        $('#theme').text(theme)
        //$('#playerCard').click() save card
        //$('#selectBtn').click() -> socket.emit("storyTheme", {theme, card})
    }



 })


//when receiving info from storyteller
let cards = []
cards.push({storyteller, storytellerCard})
socket.on("storyTheme", data => {
    //*add html element to show theme to UI
    $("#theme").text(data.theme)
    storytellerCard= data.card
    alert("select a card that matches the theme")
    //$(#playercard).onclick() -> save card
    //$(#selectBtn).onclick() -> cards.push({player, card})  ->socket.emit("similarCard", {card, player})
})


let guesses = []

socket.on("similarCard", data => {//carefull of data order
    cards.push(data)
    if (cards.length == 4 && storyteller == false){
        alert("guess which card is the storytellers")
        //$(#choosencard).onclick() -> save card
        //$(#guessBtn).onclick() -> guesses.push({player, card}) -> socket.emit("guessCard", {card, player})

    }
})

socket.on("guessCard", data => { //careful of data order
    guesses.push(data)
    if(guesses.length == 3){
        //start voting
        //meshals .....
    }

})



