const socket = io.connect('http://localhost:3030')

let userId = sessionStorage.getItem('userId')
let userName = sessionStorage.getItem('userName')
let rawcards = sessionStorage.getItem('cards')
let cards = rawcards.split(",").map(Number);
let score = sessionStorage.getItem('score')


let storyteller;

//in case of send the user array back to server for next storyteller
//sort it here
let userInRoom = []

//jquery UI dialogs
$( function() {
    $( "#welcomeDialog" ).dialog();
    $( "#welcomeDialog" ).parent().find(".ui-dialog-titlebar-close").hide()
} );
$( function() {
    $( "#themeDialog" ).dialog();
    $( "#themeDialog" ).parent().find(".ui-dialog-titlebar-close").hide()
} );



const findStoryteller = (array) => {
    for (let index = 0; index < array.length - 1; index++) {
        if (array[index].storytellerNo - array[index + 1].storytellerNo == 1) {

            return array[index]
        }

    }

}

const startGame = (data) => {

    if(cards.length < 6 )//if the next round
    {
        data.forEach(element => {
            if(element.userId == userId){
                cards.push(element.card)
            }
        });
    }
    //when this round finished, this will be send back to server to decide next storyteller
    userInRoom = data;
    console.log('all user in room ');
    console.log(userInRoom);
    alert("found players")

    //the information about storyteller
    storyteller = findStoryteller(data)
    if (userId == storyteller.userId) {
        console.log(`you are the story teller`);
        sessionStorage.setItem('storyteller', 'true')
        //document.getElementById("themeDialog").style.display = "true";
        $("#themeDialog").show();
        let theme;
        $("#themeBtn").click(function(){
            let thisTheme = $('#themeInput').val();
            console.log(thisTheme);
            theme = thisTheme;
            $('#themeDialog').dialog('close');
            //either use emit or set variable and emit elsewhere
            socket.emit("theme", {userId, userName, thisTheme})
        })



    } else {
        console.log(`you are not the storyteller `);
        sessionStorage.setItem('storyteller', 'false')
        $('#themeDialog').dialog('close');
    }
    document.getElementById("p1c1").src = mapCard(cards[0])
    document.getElementById("p1c2").src = mapCard(cards[1])
    document.getElementById("p1c3").src = mapCard(cards[2])
    document.getElementById("p1c4").src = mapCard(cards[3])
    document.getElementById("p1c5").src = mapCard(cards[4])
    document.getElementById("p1c6").src = mapCard(cards[5])

}

function mapCard(cardsIndex) {
    let deckPath = "dixitCards/"
    let card = deckPath.concat(cardsIndex)
    card = card.concat(".PNG")
    console.log("card:   ", cardsIndex)
    console.log("card path:   ", card)
    return card
}




/**
 * 
 * @param {integer} cardSelected 
 */
//when a card is selected, call this function 
//such as storyteller take a card and other players select a similar card 
const ChoiceCard = (cardSelected) => {
    sessionStorage.setItem('holdCard', cardSelected)
    //delete card from hand
    cards = removeCardFromHand(cards, cardSelected)

    //change own ui here
    //because if we change own ui here we dot have to send the card data which will broadcast to everyone

    //emit to server so server can send back for all ui changes
    //such as one card from hand disappear and move one card to middle
    socket.emit('ChoiceCard', {
        userId: userId,
        room: sessionStorage.getItem('room')
    }) //dot need to send the card data ect since its only for ui change


}

/**
 * 
 * @param {[integer]} cardArray 
 */
const removeCardFromHand = (cardArray, cardToBeRemove) => {
    let index = cardArray.indexOf(cardToBeRemove)
    //delete that card from hand
    if (index > -1) cardArray.splice(index, 1)
    else console.log(`err`);

    //return the deleted array
    return cardArray
}

/**
 * 
 * @param {the message from html element} message 
 */
//this function is for storyteller to send message to server side 
const sendMessage = (message) => {
    let payload = {
        storyTeller: true,
        score: score,
        userName: userName,
        userId: userId,
        room: sessionStorage.getItem('room'),
        holdCard: sessionStorage.getItem('holdCard'),
        message,
        message
    }
    socket.emit('storyTheme', payload)
}

//function to vote
const vote = () => {
    let payload = {
        storyTeller: false,
        score: score,
        userName: userName,
        userId: userId,
        room: sessionStorage.getItem('room'),
        holdCard: sessionStorage.getItem('holdCard'),
        voteCard: null //sessionStorage.getItem('voteCard'), when vote set this item to session

    }
    socket.emit('vote', payload)
}

//function to start next round, maybe a button or timer 
const nextRound= ()=>{
    let room = sessionStorage.getItem('room')
    //only storyteller send the req to server to avoid duplicate respond
    if(userId == storyteller.userId){
        socket.emit('nextRound', {userInRoom,room })
    }

}


//
//
//  START
//
//
//
$(document).ready(function () {
    console.log("user name:    ", sessionStorage.getItem('userName'));
    console.log("user id:    ", sessionStorage.getItem('userId'));
    console.log("score is :    ", sessionStorage.getItem('score'));
    console.log('user cards are');
    console.log(cards);
    console.log("length of cards:   ", cards.length)
    document.getElementById("voteBtn").style.display = "none"; //design choice
    document.getElementById("guessBtn").style.display = "none"; //design choice
    document.getElementById("themeDialog").style.display = "none"; //hide ui dialog (Bugged)

    //tie in with button when socket.emit is recieved
    $(".p1card").click(function(){ //class of player 1 cards
        console.log("you clicked a card, good job!")
        console.log("card clicked:    " ,this.src)



    })






    socket.emit('joinRoom', {
        userId: userId,
        userName: userName
    })


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
 * @param  { [userId:id,
 *            userName:user name,
 *            storytellerNo:integer]} data
 */
// //once received the start game event from server
socket.on('startGame', data => {
    startGame(data)
    $('#welcomeDialog').dialog('close')
})



//emit story to server first, the server record the story and then will emit back to socket 'storyTheme'(should be a io.to.emit)
//because all players has to see the story.

socket.on("storyDisplay", data => {
    //display the story to all users interface
    //some element.append such as that 
})


/**
 * @param {[storyTeller:boolean,
 *          score: index,
 *          userName:user name(string)
 *          userId:userId(string)],
 *          voteCard:card bring in this round(index),
 *          holdCard:card that belong to this user(index)
 *          } data 
 */
//this socket is used to get result from server side
socket.on('showResult', data => { 
    data.forEach(element => {
        if(element.userId == userId){
            sessionStorage.setItem('score', element.score)
        }
    });


})

//when anther player bring a card update ui
socket.on('updateUI', data => {
    userInRoom.forEach(element => {
        if (element.userId == data.userId) {
            //logic to change the ui
            //such as remove image element from that player and put a card back to the middle 
        }
    });
})