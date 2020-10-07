const { data } = require("jquery");

const socketIo = (io)=>{

    io.on('connection', (socket)=>{
        console.log('a user connected');
    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    })
    socket.on('test-socket', testData=>{
        console.log(testData);
        io.emit('test-socket',testData)
    })
    
    
    })
    
    
}




module.exports={
    openSocket: socketIo,
    
}