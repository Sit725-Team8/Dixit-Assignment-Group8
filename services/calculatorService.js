/**
 * 
 * @param {[storyTeller:boolean,
 *          score: index,
 *          userName:user name(string)
 *          userId:userId(string)],
 *          voteCard:card bring in this round(index),
 *          holdCard:card that belong to this user(index)
 *          } array 
 */
//this array should require from socket services
let storytellerCard

const calculate = array => {
    let i = 0;
    array.forEach(element => {
        if (element.storyTeller) {
            //the storyteller card which is the right result
            storytellerCard = element.holdCard

        }
    });

    //calculate how many ppl vote right
    array.forEach(element => {
        if (element.voteCard == storytellerCard && !element.storyTeller) i++;
    });
    //if every player got the result right
    //everyone score for this round is 2 except for the storyteller
    if (i == array.length - 1) {
        array.forEach(element => {
            if (!element.storyTeller) element.score += 2;
            
        });
    }
    //not everyone got right vote
    //the ppl vote right and storyteller score 3 in this round
    else {
        array.forEach(element => {
            if (element.storyTeller) element.score += 3;
            else if (element.voteCard == storytellerCard) element.score += 3;
        });
        //because some user voted wrong
        //call bonus score function 
        bonusScore(array)
    }
    return array
}

/**
 * 
 * @param {[storyTeller:boolean,
 *          userName:user name(string),
 *          score: index,
 *          userId:userId(string),
 *          voteCard:card bring in this round(index),
 *          holdCard:card that belong to this user(index),
 *          score:index
 *          } array 
 */
const bonusScore = array => {
    //for each user that voted wrong
    array.forEach(element => {
        if (element.voteCard != storytellerCard) {
            //add 1 score to the card owner 
            array.forEach(CardOwner => {
                if (element.voteCard == CardOwner.holdCard) {
                    CardOwner.score++;
                }
            });
        }
    });
}

// let mockData = [{
//         storyTeller: true,
//         score:0,
//         name: '1',
//         Id: '1',
//         voteCard:null,
//         holdCard:1
//     },{
//         storyTeller: false,
//         score:0,
//         name: '2',
//         Id: '2',
//         voteCard: 4,
//         holdCard:2
//     },{
//         storyTeller: false,
//         score:0,
//         name: '3',
//         Id: '3',
//         voteCard: 4,
//         holdCard:3
//     },{
//         storyTeller: false,
//         score:0,
//         name: '4',
//         Id: '4',
//         voteCard: 1,
//         holdCard:4
//     },

// ]

// console.log(calculate(mockData));





//still need to do the bonus points 
module.exports = {
    calculate
}