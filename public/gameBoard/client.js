//const { data } = require("jquery");

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
let selectedCard;
let guessCard;

//jquery UI dialogs
$(function () {
    $("#welcomeDialog").dialog();
    $("#welcomeDialog").parent().find(".ui-dialog-titlebar-close").hide()
    // $("#welcomeDialog").dialog({
    //     autoOpen: false
    // }).dialog("widget").find(".ui-dialog-title").hide();​
});

$(function () {
    $("#themeDialog").dialog();
    $("#themeDialog").parent().find(".ui-dialog-titlebar-close").hide()

});

$(function () {
    $("#chooseCardDialog").dialog();

});




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
    document.getElementById("themeCardBtn").style.display = "none"; //design choice
    document.getElementById("themeDialog").style.display = "none"; //hide ui dialog (Bugged)
    document.getElementById("chooseCardDialog").style.display = "none";

    //init
    document.getElementById("p2c6").style.visibility = 'visible';
    document.getElementById("p3c6").style.visibility = 'visible';
    document.getElementById("p4c6").style.visibility = 'visible';
    document.getElementById("p1c6").style.visibility = 'visible'
    //tie in with button when socket.emit is recieved
    $(".p1card").click(function () { //class of player 1 cards
        console.log("card clicked:    ", this.src) //test
        selectedCard = this.src
        console.log("Selected Card Var:   ", selectedCard)



    })
    $(".midCard").click(function () { //class of player 1 cards
        console.log("card clicked:    ", this.src) //test
        guessCard = this.src
        console.log("Selected Card Var:   ", selectedCard)



    })
    $("#themeDialog").dialog('close');
    $("#chooseCardDialog").dialog('close');

    //start the game 
    socket.emit('joinRoom', {
        userId: userId,
        userName: userName
    })




});



const findStoryteller = (array) => {
    for (let index = 0; index < array.length - 1; index++) {
        if (array[index].storytellerNo - array[index + 1].storytellerNo == 1) {

            return array[index]
        }

    }

}


const startGame = (data) => {

    if (cards.length < 6) //if the next round
    {
        data.forEach(element => {
            if (element.userId == userId) {
                cards.push(element.card)
            }
        });
    }
    //when this round finished, this will be send back to server to decide next storyteller
    userInRoom = data;
    console.log('all user in room ');
    console.log(userInRoom);

    //the information about storyteller
    storyteller = findStoryteller(data)
    if (userId == storyteller.userId) {
        console.log(`you are the story teller`);
        sessionStorage.setItem('storyteller', 'true')
        $("#themeCardBtn").show();

        $("#themeCardBtn").click(function () {
            if (selectedCard != null) {
                $('#themeDialog').dialog('open')
                $("#themeDialog").show();

            }
        })

        let theme;
        $("#themeBtn").click(function () {
            let thisTheme = $('#themeInput').val();
            console.log(thisTheme);
            theme = thisTheme;
            $('#themeDialog').dialog('close');
            let cardIndex = selectedCard.match(/\d+/g).map(Number); // replace all leading non-digits with nothing
            console.log("cardIndex: ", cardIndex)
            let theCard = parseInt(cardIndex[1])
            console.log("the card:  ", theCard)
            ChoiceCard(cardIndex[1]);
            sendMessage(theme);
            $("#themeCardBtn").hide()
            theme = null //maybe stop error later idk
            //either use emit or set variable and emit elsewhere
            //socket.emit("theme", {userId, userName, thisTheme})
            //call send message method
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
    document.getElementById("p1c1").src = mapCard(cards[0])
    document.getElementById("p1c2").src = mapCard(cards[1])
    document.getElementById("p1c3").src = mapCard(cards[2])
    document.getElementById("p1c4").src = mapCard(cards[3])
    document.getElementById("p1c5").src = mapCard(cards[4])
    document.getElementById("p1c6").style.visibility = 'hidden'



    let storytellerBool = false
    if (sessionStorage.getItem('storyteller') == 'true') {
        storytellerBool = true
    } else {
        let payload = {
            storyTeller: storytellerBool,
            score: score,
            userName: userName,
            userId: userId,
            room: sessionStorage.getItem('room'),
            holdCard: sessionStorage.getItem('holdCard')
        }
        //emit to server so server can send back for all ui changes
        //such as one card from hand disappear and move one card to middle
        socket.emit('ChoiceCard', payload) //dot need to send the card data ect since its only for ui change
    }





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
        message: message
    }
    socket.emit('storyTheme', payload)
}

//function to vote
const vote = (card) => {
    let payload = {
        userName: userName,
        userId: userId,
        room: sessionStorage.getItem('room'),
        voteCard: card //sessionStorage.getItem('voteCard'), when vote set this item to session

    }
    socket.emit('vote', payload)
}

//function to start next round, maybe a button or timer 
const nextRound = () => {
    let room = sessionStorage.getItem('room')
    //only storyteller send the req to server to avoid duplicate respond
    if (userId == storyteller.userId) {
        socket.emit('nextRound', {
            userInRoom,
            room
        })
    }

}






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



const otherPlayerAction = () => {
    //simliar logic 
}



socket.on("storyDisplay", data => {
    //display the story to all users interface
    //some element.append such as that
    let theme = data
    console.log("theme recieved:  ", theme)
    $("#themeTag").text(("Theme: ", theme))
    if (userId != storyteller.userId) {
        $("#themeCardBtn").show()

        $("#themeCardBtn").click(function () {
            if (selectedCard != null) {
                let cardIndex = selectedCard.match(/\d+/g).map(Number); // replace all leading non-digits with nothing
                console.log("cardIndex: ", cardIndex)
                let theCard = parseInt(cardIndex[1])
                console.log("the card:  ", theCard)
                ChoiceCard(cardIndex[1]);
                $("#themeCardBtn").hide()

            }
        })
    }
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
        if (element.userId == userId) {
            sessionStorage.setItem('score', element.score)
        }
    });
    console.log("username:  ", data[0].userName)
    console.log("score:  ", data[0].score)
    console.log("username:  ",data[1].userName)
    console.log("score:  ",data[1].score)
    console.log("username:  ", data[2].userName)
    console.log("score:  ", data[2].score)
    console.log("username:  ",data[3].userName)
    console.log("score:  ",data[3].score)
    $("#playerN1").html(data[0].userName)
    $("#score1").html(data[0].score)
    $("#playerN2").html(data[1].userName)
    $("#score2").html(data[1].score)
    $("#playerN3").html(data[2].userName)
    $("#score3").html(data[2].score)
    $("#playerN4").html(data[3].userName)
    $("#score4").html(data[3].score)

})

/**
 * @param {[storyTeller:boolean,
 *          score: index,
 *          userName:user name(string)
 *          userId:userId(string)],
 *          holdCard:card that belong to this user(index)
 *          } data 
 */
socket.on('updateUI', data => {
    //change the other players ui


    //display the cards that all players bring out for vote

    document.getElementById("p2c6").style.visibility = 'hidden';
    document.getElementById("p3c6").style.visibility = 'hidden';
    document.getElementById("p4c6").style.visibility = 'hidden';
    let count = 1;



    let array = [];
    while (array.length < 4) {
        var r = Math.floor(Math.random() * 4);
        if (array.indexOf(r) === -1) array.push(r);
    }
    console.log(array);
    let thisID = "guess"
    console.log("ID:   ", thisID)
    array.forEach(element => {
        let cardId = thisID + count;
        console.log(cardId);
        count++;
        document.getElementById(cardId).src = './dixitCards/'+ data[element].holdCard+'.png'
        console.log(data[element]);
    });

    


    if (sessionStorage.getItem('storyteller') == 'false') {
        //can ask players to vote here
        $("#voteBtn").show()
        $("#voteBtn").click(function () {
            if (guessCard != null) {
                let realCard = guessCard.match(/\d+/g).map(Number); // replace all leading non-digits with nothing
                console.log("cardIndex: ", realCard)
                realCard = parseInt(realCard[1])
                console.log("the card:  ", realCard)

                vote(realCard);
                $("#voteBtn").hide()
            }
        })
    }


})

socket.on('endGame', ()=>{
    alert('The game has finished, you can see the scoreboard at left top, thanks for your playing')
})