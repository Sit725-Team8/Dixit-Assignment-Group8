//load hand
//decide storyteller
//....


//maybe counter measures to ensure that all players are in the same stage
const socket = io();


socket.on("storyteller", () => { //informs storyteller
    //$storyteller.text = data


})

//might need timer
if (player == storyteller) {
    socket.emit("storyteller", {theme, card})//maybe dont need in later build
    prompt("choose a theme and card") //needs change
    //once selected
    socket.emit("storyTheme", {theme, card})
}


let themeCard;
socket.on("storyTheme", () => {  //get theme and card
    themeCard = data.card
    //$theme.text = theme
    alert("choose a card that matches the theme") //needs change
    //once selected
    socket.emit("replyTheme", {card, player})
})

let replies;
socket.on("replyTheme", () => {
    replies.append(data.card)
    if (replies.length == 3){
        //map to center randomly with theme card
        if (player != storyteller) {
            //start voting process
            socket.emit("selectedCard", {card, player})
        }
    }

})

let votes;
socket.on("replyTheme", () => {
    votes.append(data)
    if (votes.length == 3){
        //calculate score
        if (endOfGame){
            //finish game
        }
        else{
            //next storyteller
        }
    }
})






