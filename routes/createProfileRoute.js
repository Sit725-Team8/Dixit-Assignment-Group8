const Express = require('express')
const controller = require('../controllers/createProfileController')


let router = Express.Router()

router.post('/',(req,res)=>{
    let player = req.body;
    console.log(player);
    res.render('game');
    controller.addPlayer(player,res)
})







//export the file
module.exports={
    createProfileRoute:router
}