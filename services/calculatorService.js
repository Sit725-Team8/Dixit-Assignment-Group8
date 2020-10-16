// const socket = require('./socketServices')
// let array = socket.resultArray

// console.log(array);

const calculate = array=>{
    let i = 0;
    //calculate how many ppl vote right
    array.forEach(element => {
        if(element.vote && !element.storyTeller) i++;
    });
    //if every player got the result right
    //everyone score for this round is 2 except for the storyteller
    if(i == array.length-1){
        array.forEach(element => {
            if(element.storyTeller) element.score = 0;
            else element.score = 2
        });
    }
    //not everyone got right vote
    //the ppl vote right and storyteller score 3 in this round
    else{
        array.forEach(element => {
            if(element.storyTeller) element.score = 3;
            else if(element.vote) element.score = 3;
            else element.score = 0;
        });
    }
    return array
}
//still need to do the bonus points 
module.exports={
    calculate
}
