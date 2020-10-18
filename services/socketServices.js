
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
    
    
    })
    
    
}




module.exports={
    openSocket: socketIo,
    
}