//get the name from input filed



//two variables to identify the user 
// export let userId;
// export let userName;

// sessionStorage.setItem('test','testSession');
// let session = sessionStorage.getItem('test')
// console.log(session+ '  is session');
// var string = 'this is a string';


//wrap it in a package and sends it to the server
const newPlayer = async () => {
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
    await $.ajax({
        url: '/createProfile',
        contentType: 'application/json',
        data: JSON.stringify(data),
        type: 'POST',
        success: (result) => {
            //give that two variables values
            //which you can use what ever in this user's front end
            console.log(result);
            sessionStorage.setItem('userName', result.name);
            sessionStorage.setItem('userId', result.Id);
            // console.log('set session'+sessionStorage.getItem('userId'));
            // console.log('set session'+sessionStorage.getItem('userName'));

            console.log(sessionStorage.getItem('userName'));
            console.log(sessionStorage.getItem('userId'));
        }


    })
    await assignCard();

};
const assignCard = () => {
    let id = sessionStorage.getItem('userId')
    let name = sessionStorage.getItem('userName')
    let data = {
        userId: id,
        userName: name
    }
    console.log(`data from assign cards ${data.userName}`);
    $.ajax({
        url: '/assignCards',
        contentType: 'application/json',
        data: JSON.stringify(data),
        type: 'POST',
        success: (result) => {
            //give that two variables values
            //which you can use what ever in this user's front end
            console.log(result);
            sessionStorage.setItem('cards', result.cards);
            console.log(sessionStorage.getItem('cards'));
        }
    })


}


$(document).ready(() => {
    console.log('Ready')
    //create a new player
    $('#profileButton').click(newPlayer);



    //test the are the user id and user name correct 
    $('#testButton').click(() => {
            console.log(sessionStorage.getItem('userName'));
            console.log(sessionStorage.getItem('userId'));
            // console.log(userId);
            // console.log(userName);
        }

    )

    


})