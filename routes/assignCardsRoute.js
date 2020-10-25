const express = require('express')
const controller = require('../controllers/assignCardsController')

let router = express.Router();

router.post('/', (req,res)=>{
    let player = req.body;
    
    controller.assignCards(player,res)
    setTimeout(() => {
        console.log(`body from assign card router ${player.userName} ${player.userId}`);
        
    }, 5000);
})

module.exports={
    router
}