let test = require('./test')

let array = test.array

const test2 =()=>{
    console.log('step1');
    test.display(array)
    
    console.log('step2');
    test.remove(array)
    test.display(array)
    console.log('step3');
    test.remove(array)
    test.display(array)
}



module.exports={
    test2

}