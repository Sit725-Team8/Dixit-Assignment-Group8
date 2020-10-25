


// let testData = [ { Id: '5f9018691dda013568df2a09',
//     name: '5',
//     storytellerNo: 1,
//     room: 'room2' },
//   { Id: '5f9018741dda013568df2a0a',
//     name: '6',
//     storytellerNo: 1,
//     room: 'room2' },
//   { Id: '5f90187d1dda013568df2a0b',
//     name: '7',
//     storytellerNo: 1,
//     room: 'room2' },
//   { Id: '5f9018871dda013568df2a0c',
//     name: '8',
//     storytellerNo: 1,
//     room: 'room2' } ]
const passStoryteller = (currentPlayersArray,io,room) => {
    //record how many players has been twice storyteller
    let countOfPlayedOnce = 0;
    let countOfPlayedTwice = 0;
    
    //calculate the players has been twice storyteller
    currentPlayersArray.forEach(element => {
        if (element.storytellerNo == 2) {
            countOfPlayedTwice++
        }
        if(element.storytellerNo ==1){
            countOfPlayedOnce++
        }
    });
    //due to the rule, if every player been twice storyteller
    //the game should finish
    if(countOfPlayedTwice == 4){
        console.log('The game should finish');
        //io.to(room).emit('finish game')
    }else if(countOfPlayedOnce == 4){ //if every player played once 
        currentPlayersArray[0].storytellerNo++
        io.to(room).emit('startGame', currentPlayersArray)
    }
    else{
        //pass the storyteller to next player 
        for (let index = 0; index < currentPlayersArray.length - 1; index++) {
            if(currentPlayersArray[index].storytellerNo - currentPlayersArray[index+1].storytellerNo == 1){
                let storyteller = currentPlayersArray[index+1]
                storyteller.storytellerNo++;
                console.log('pass the storyteller to next player');
                console.log(storyteller);
                break;
            }
            
        }

        io.to(room).emit('startGame', currentPlayersArray)
    }

    //return currentPlayersArray

}

    // console.log('the current players array after pass the storyteller');
    // console.log(passStoryteller(testData));
    module.exports = {
        passStoryteller
    }
