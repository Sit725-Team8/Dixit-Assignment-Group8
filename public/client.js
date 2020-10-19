const socket = io.connect('http://localhost:3030')

const testButton = document.getElementById('socketButton');
const testInput = document.getElementById('socketInput');
const testOutput = document.getElementById('socketOutput');
const calButton = document.getElementById('calculatorBtn');

// import {
//     userId,
//     userName
// } from './env.js'

socket.on('test-socket', data => {
    var node = document.createElement('Li')
    var textNode = document.createTextNode(data.story);
    node.appendChild(textNode)
    testOutput.appendChild(node)
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
    let payload={}
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

socket.on('join', data => {
    console.log('You have conncted to Room: ' + data);
 })


socket.on('addplayer', message => {
    console.log(message);
 })


joinRoom.addEventListener('click',()=>{
    const playerName = document.getElementById('inputName').value;   
    let payload = {'playerName': playerName}
    socket.emit('join', payload)
})