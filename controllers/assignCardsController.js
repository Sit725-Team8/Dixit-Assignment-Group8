const service = require('../services/assignCardService')
const cardsArrayIndex = service.array

const assignCards=(playerInfo, res)=>{
    
    service.cardsResult(playerInfo,cardsArrayIndex,res)
}

module.exports={
    assignCards
}

