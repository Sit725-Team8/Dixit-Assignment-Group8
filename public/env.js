//get the name from input filed

//two variables to identify the user 
let userId;
let userName;

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
    //a POST request for insert the user data into the database 
    $.ajax({
        url: '/createProfile',
        contentType: 'application/json',
        data: JSON.stringify(data),
        type: 'POST',
        success: (result) => {
            //give that two variables values
            //which you can use what ever in this user's front end
            console.log(result);
            userId = result.Id;
            userName = result.name;

        }


    })
}


//testing socket functions 
let socket = null;

$(document).ready(() => {
    console.log('Ready')
    //create a new player
    $('#profileButton').click(newPlayer);

    //testing socket functions 
    $('#socketButton').click(() => {
        let message = $('#socketInput').val();
    
        //the stroy with user id and name 
        let payload = {
            'story': message,
            'senderId': userId,
            'senderName': userName
        }
        //emit the payload to the server side 
        socket.emit('test-socket', payload)
    
    })
    socket = io();
    socket.on('test-socket', data => {
        $('#socketOutput').append($('<li>').text(data.story))
    })

    //test the are the user id and user name correct 
    $('#testButton').click(() => {
            console.log(userId);
            console.log(userName);
        }

    )


})