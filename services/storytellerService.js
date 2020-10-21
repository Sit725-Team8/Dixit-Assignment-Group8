//an array for testing propose 
let testArray = [{
        Id: '5f8fe8370b638120c4cf3a60',
        name: '11',
        storytellerNo: 2,
        room: 'room1'
    },
    {
        Id: '5f8fe83f0b638120c4cf3a61',
        name: '22',
        storytellerNo: 1,
        room: 'room1'
    },
    {
        Id: '5f8fe8460b638120c4cf3a62',
        name: '33',
        storytellerNo: 1,
        room: 'room1'
    },
    {
        Id: '5f8fe84e0b638120c4cf3a63',
        name: '44',
        storytellerNo: 1,
        room: 'room1'
    }
]

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
        for (let index = 0; index < currentPlayersArray.length; index++) {
            if(currentPlayersArray[index].storytellerNo - currentPlayersArray[index+1].storytellerNo == 1){
                currentPlayersArray[index+1].storytellerNo++;
                console.log('pass the storyteller to next player');
                break;
            }
            
        }
    }
    console.log(currentPlayersArray);
}
passStoryteller(testArray)