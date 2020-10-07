//get the name from input filed
//wrap it in a package and sends it to the server
const newPlayer = () => {
    let text = $('#inputName').val()
    console.log(text);
    let data = {
        name: text,
        storyTold: 0,
        stories: [],
        score: 0
    }
    console.log(data);
    $.ajax({
        url: '/createProfile',
        contentType: 'application/json',
        data: JSON.stringify(data),
        type: 'POST',
        success: (result) => {
            console.log(result);
        }

    })
}
//testing socket functions 
let socket = null;
const sendMessage = ()=>{
    let message = $('#socketInput').val();
    
    //try to use user id
    let payload={
        'story':message,
        'senderId':'test'
    }
    socket.emit('test-socket',payload)

}
$(document).ready(() => {
    console.log('Ready')
    $('#profileButton').click(newPlayer);
    
    //testing socket functions 
    $('#socketButton').click(sendMessage)
    socket = io();
    socket.on('test-socket',data=>{
        $('#socketOutput').append($('<li>').text(data.story))
    })
    


})