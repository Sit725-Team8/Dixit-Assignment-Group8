let array = []

while (array.length < 6) {
    array.push(Math.random())

}

const display = (array) => {
    array.forEach(element => {
        console.log(element);
    });
}
const remove = (array) => {
    let pop = array.pop()
    console.log(`the element deleted is ${pop}`);
}


console.log('required');
module.exports={
    display,
    remove,
    array
}