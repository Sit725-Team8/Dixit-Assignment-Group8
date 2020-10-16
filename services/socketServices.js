const cal = require('./calculatorService')
let resultArray = []
//started the socket io
const socketIo = (io)=>{
    //while a user connected 
    io.on('connection', (socket)=>{
        console.log('a user connected');
    //while user disconnected 
    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    })
    //get the data from a user and then broadcast to all users 
    socket.on('test-socket', testData=>{
        console.log(testData);
        io.emit('test-socket',testData)
    })
    socket.on('send-result', data=>{
        console.log(data);
        resultArray.push(data)
        //for test propose 
        if (resultArray.length==4){
            let array = cal.calculate(resultArray)
            console.log('test cal result');
            console.log(array);
        }
    })



    })
    
    
    
}




module.exports={
    openSocket: socketIo,
    resultArray
    
}