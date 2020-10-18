const socket = io.connect('http://localhost:3030')

const testButton = document.getElementById('socketButton');
const testInput = document.getElementById('socketInput');
const testOutput = document.getElementById('socketOutput');

import {userId, userName} from  './env.js'

socket.on('test-socket', data => {
    var node = document.createElement('Li')
    var textNode = document.createTextNode(data.story);        
    node.appendChild(textNode)
    testOutput.appendChild(node)
})

testButton.addEventListener('click',()=>{
    let message = testInput.value;
    console.log(userId,userName);
    console.log(message);
    let payload = {
                'story': message,
                'senderId': userId,
                'senderName': userName
            }
    socket.emit('test-socket', payload)
})
