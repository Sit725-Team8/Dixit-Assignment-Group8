

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
            sessionStorage.setItem('score', 0)
            

            console.log(sessionStorage.getItem('userName'));
            console.log(sessionStorage.getItem('userId'));
            console.log(sessionStorage.getItem('score'));
        }


    })
    await assignCard();

};
const assignCard = async() => {
    let id = await sessionStorage.getItem('userId')
    let name = await sessionStorage.getItem('userName')
    let data = await {
        userId: id,
        userName: name
    }
    console.log(`data from assign cards ${data.userName}`);
    await $.ajax({
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
   await window.location.replace('./gameBoard/index.html');
  

}


$(document).ready(() => {
    console.log('Ready')
    //create a new player
    $('#profileButton').click(newPlayer);

    


})