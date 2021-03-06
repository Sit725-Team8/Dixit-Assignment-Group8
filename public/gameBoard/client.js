//const { data } = require("jquery");

const socket = io.connect('http://localhost:3030')

let userId = sessionStorage.getItem('userId')
let userName = sessionStorage.getItem('userName')
let rawcards = sessionStorage.getItem('cards')
let cards = rawcards.split(",").map(Number);




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
    // let rawcards = sessionStorage.getItem('cards')
    // let cards = rawcards.split(",").map(Number);
    console.log(cards);
    console.log("length of cards:   ", cards.length)
    document.getElementById("voteBtn").style.display = "none"; //design choice
    document.getElementById("themeCardBtn").style.display = "none"; //design choice
    document.getElementById("themeDialog").style.display = "none"; //hide ui dialog (Bugged)
    document.getElementById("chooseCardDialog").style.display = "none";


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

    let playOnce = 0;
    let playTwice = 0;
    let node
    for (let index = 0; index < array.length - 1; index++) {
        if (array[index].storytellerNo == 1) playOnce++;
        if (array[index].storytellerNo == 2) playTwice++;
        if (array[index].storytellerNo - array[index + 1].storytellerNo == 1) {

            node = array[index]
        }


    }
    if (playOnce == 3 && array[3].storytellerNo == 1) node = array[3]
    if (playTwice == 3 && array[3].storytellerNo == 2) node = array[3]
    return node


}


const startGame = (data) => {
    //init
    $("#themeCardBtn").off()
    $("#themeBtn").off()
    $("#voteBtn").off()
    document.getElementById("p2c6").style.visibility = 'visible';
    document.getElementById("p3c6").style.visibility = 'visible';
    document.getElementById("p4c6").style.visibility = 'visible';
    document.getElementById("p1c6").style.visibility = 'visible';
    document.getElementById('guess1').src = './dixitCards/36.PNG'
    document.getElementById('guess2').src = './dixitCards/36.PNG'
    document.getElementById('guess3').src = './dixitCards/36.PNG'
    document.getElementById('guess4').src = './dixitCards/36.PNG'
    document.getElementById("voteBtn").style.display = "none"; //design choice
    document.getElementById("themeCardBtn").style.display = "none"; //design choice
    document.getElementById("themeDialog").style.display = "none"; //hide ui dialog (Bugged)
    document.getElementById("chooseCardDialog").style.display = "none";

    selectedCard = null
    guessCard = null


    $("#themeDialog").dialog('close');
    $("#chooseCardDialog").dialog('close');
    // let rawcards = sessionStorage.getItem('cards')
    // let cards = rawcards.split(",").map(Number);
    let score = sessionStorage.getItem('score')
    if (cards.length < 6) //if the next round
    {
        data.forEach(element => {
            if (element.userId == userId) {
                cards.push(element.card)
            }
        });
    }

    console.log(`cards are`);
    console.log(cards);
    console.log(`score is ${score}`);
    //when this round finished, this will be send back to server to decide next storyteller
    userInRoom = data;
    console.log('all user in room ');
    console.log(userInRoom);

    //the information about storyteller
    storyteller = findStoryteller(data)
    console.log(`storyteller is `);
    console.log(storyteller);
    if (userId == storyteller.userId) {
        alert('You are the storyteller, please select a card and write a theme base on that')
        console.log(`you are the story teller`);

        sessionStorage.setItem('storyteller', 'true')
        console.log(sessionStorage.getItem('storyteller'));
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
        console.log(sessionStorage.getItem('storyteller'));
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
    // let rawcards = sessionStorage.getItem('cards')
    // let cards = rawcards.split(",").map(Number);
    cards = removeCardFromHand(cards, cardSelected)
    console.log(`the card array after remove is `);
    console.log(cards)

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
            score: sessionStorage.getItem('score'),
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
    if (index > -1) {
        cardArray.splice(index, 1)
    } else console.log(`err`);
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
        score: sessionStorage.getItem('score'),
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
        alert('Please select a card that you think match the theme below')
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
    console.log("username:  ", data[1].userName)
    console.log("score:  ", data[1].score)
    console.log("username:  ", data[2].userName)
    console.log("score:  ", data[2].score)
    console.log("username:  ", data[3].userName)
    console.log("score:  ", data[3].score)

    document.getElementById('playerN1').innerHTML = (data[0].userName)
    document.getElementById('score1').innerHTML = (data[0].score)
    document.getElementById('playerN2').innerHTML = (data[1].userName)
    document.getElementById('score2').innerHTML = (data[1].score)
    document.getElementById('playerN3').innerHTML = (data[2].userName)
    document.getElementById('score3').innerHTML = (data[2].score)
    document.getElementById('playerN4').innerHTML = (data[3].userName)
    document.getElementById('score4').innerHTML = (data[3].score)

    console.log(`go to next round after 5 s`);
    alert('next round start in 5 seconds')
    setTimeout(() => {
        // nextRound
        if (sessionStorage.getItem('storyteller') == 'true') {
            console.log(`i emit next round`);
            socket.emit('nextRound', userInRoom)
        }
    }, 4000); // 4s because 1s timeout would be used to pass storyteller
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
        document.getElementById(cardId).src = './dixitCards/' + data[element].holdCard + '.png'
        console.log(data[element]);
    });




    if (sessionStorage.getItem('storyteller') == 'false') {
        alert(`please vote for the card you think belong to storyteller, do not vote for yourself`)
        //can ask players to vote here
        $("#voteBtn").show()
        $("#voteBtn").click(function () {
            if (guessCard != null) {

                let realCard = guessCard.match(/\d+/g).map(Number); // replace all leading non-digits with nothing
                console.log("cardIndex: ", realCard)
                realCard = parseInt(realCard[1])
                console.log("the card:  ", realCard)

                if (realCard == sessionStorage.getItem('holdCard')) {
                    alert(`You cant vote for your own card`)
                } else {
                    vote(realCard);
                    $("#voteBtn").hide()
                }

            }
        })
    }


})

socket.on('endGame', () => {
    alert('The game has finished, you can see the scoreboard at left top, thanks for your playing')
    console.log(`should end game`);
})