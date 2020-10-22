


// // let testData = [ { Id: '5f9018691dda013568df2a09',
// //     name: '5',
// //     storytellerNo: 1,
// //     room: 'room2' },
// //   { Id: '5f9018741dda013568df2a0a',
// //     name: '6',
// //     storytellerNo: 0,
// //     room: 'room2' },
// //   { Id: '5f90187d1dda013568df2a0b',
// //     name: '7',
// //     storytellerNo: 0,
// //     room: 'room2' },
// //   { Id: '5f9018871dda013568df2a0c',
// //     name: '8',
// //     storytellerNo: 0,
// //     room: 'room2' } ]
const passStoryteller = (currentPlayersArray) => {
    //record how many players has been twice storyteller
    let count = 0;
    //calculate the players has been twice storyteller
    currentPlayersArray.forEach(element => {
        if (element.storytellerNo == 2) {
            count++
        }
    });
    //due to the rule, if every player been twice storyteller
    //the game should finish
    if(count == 4){
        console.log('The game should finish');
    }else{
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
    }
    console.log('the current players array after pass the storyteller');
    console.log(currentPlayersArray);
    return currentPlayersArray

}

// passStoryteller(testData)