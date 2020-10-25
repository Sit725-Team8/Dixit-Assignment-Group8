let array = [];
while (array.length < 36) {
    var r = Math.floor(Math.random() * 36) + 1;
    if (array.indexOf(r) === -1) array.push(r);
}


const display = (array) => {
    array.forEach(element => {
        console.log(element);
    });
}

const assignCard = (array) => {
    let node = array.shift()
    array.push(node)
    return node
}

const cardsResult = (playerInfo, array, res) => {
    let cards = []
    while (cards.length < 6) {
        cards.push(assignCard(array))
    }
    let result = {
        message: 'assign 6 cards for this player',
        player: playerInfo,
        cards: cards
    }
    res.json(result)
    console.log(result.cards);

}

module.exports = {
    display,
    array,
    cardsResult,
    assignCard
}