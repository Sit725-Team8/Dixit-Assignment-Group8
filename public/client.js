


const socket = io.connect('http://localhost:3030')

const testButton = document.getElementById('socketButton');
const testInput = document.getElementById('socketInput');
const testOutput = document.getElementById('socketOutput');
const calButton = document.getElementById('calculatorBtn');
const joinRoom = document.getElementById('joinRoom');


const redirect = document.getElementById('redirect')

// import {
//     userId,
//     userName
// } from './env.js'

socket.on('test-socket', data => {
    var node = document.createElement('Li')
    var textNode = document.createTextNode(data.story);
    node.appendChild(textNode)
    testOutput.appendChild(node)
    console.log(`test `);
})

testButton.addEventListener('click', () => {
    let userId = sessionStorage.getItem('userId')
    let userName = sessionStorage.getItem('userName')
    let message = testInput.value;
    console.log(userId, userName);
    console.log(message);
    let payload = {
        'story': message,
        'senderId': userId,
        'senderName': userName
    }
    socket.emit('test-socket', payload)
})

let i = 0;
calButton.addEventListener('click', () => {
    let userId = sessionStorage.getItem('userId')
    let userName = sessionStorage.getItem('userName')
    //since the vote function have done use random value
    let random = Math.floor(Math.random() * 2);
    let voteResult = (random == 0) ? true : false;
    //for test propose
    let payload = {}
    if (i == 0) {
        payload = {
            name: userName,
            id: userId,
            vote: voteResult,
            storyTeller: true
        }
        i++;
    } else {
        payload = {
            name: userName,
            id: userId,
            vote: voteResult,
            storyTeller: false
        }
    }
    console.log(payload);
    console.log(i);
    //send the vote data to the server
    socket.emit('send-result', payload)
})


let j = 0
redirect.addEventListener('click', () => {
    j++
    console.log(j);
    if (j === 5) {
        window.location.replace('./gameBoard/index.html');
    }
})
//when join room button clicked
joinRoom.addEventListener('click', () => {
    //get the user id and name from session 
    let userId = sessionStorage.getItem('userId')
    let userName = sessionStorage.getItem('userName')
    let payload = {
        userId: userId,
        userName: userName
    }
    //send the user inf to the server side via socket
    socket.emit('joinRoom', payload)
    
})

//sort the room in the session in case of use that in future
socket.on('roomNumber', data => {
    //set teh session 
    sessionStorage.setItem('room', data.room)
    let playerNo = data.playNo
    console.log(`the room is ${sessionStorage.getItem('room')}`);
    //check the number of player in the room
    let numberOfPlayerInRoom = playerNo%4
    let waitNumberOfPlayer = 4- numberOfPlayerInRoom
    //display in console
    console.log(`you are the No.${numberOfPlayerInRoom} in the room, will wait for ${waitNumberOfPlayer} to start the game `);
    
})
//once received the start game event from server
socket.on('startGame', data=>{
    //redirect to the game board
    window.location.replace('./gameBoard/index.html');
})