const { data } = require("jquery");

    let  count2=0;
     var arr = [];
      let output1="";

const socketIo = (io)=>{

    io.on('connection', (socket)=>{
        console.log('a user connected');


    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    })


    
    
    socket.on('startgame', testData=>{
        console.log('start game'+testData);
        io.emit('startgame',testData)
    })
    





while(arr.length < 25){
    var r = Math.floor(Math.random() * 36) + 1;
    if(arr.indexOf(r) === -1) arr.push(r);
}
        
        console.log(arr);

        for (var i = 1; i < arr.length; i++) {
            arr[i]

            if (i<=6) {

          

                        socket.emit('player1',`${arr[i]}`);

        

            
             }
            
             if (i>6 && i<=12) {

                    

               
                    if (i==7) {
                             socket.emit('player3.1',`${arr[i]}`);
                    }
                    else{
                          socket.emit('player3',`${arr[i]}`);
                    }
                 
         //   document.getElementById('rightcon').innerHTML+=output;

           
                     
        //    document.getElementById('rightcon').innerHTML+=output;
           


             }


        if (i>12 && i<=18) {


                   socket.emit('player2',`${arr[i]}`);

//            document.getElementById('bottomcon').innerHTML+=output;
        }       


    if (i>18 && i<=24) {

                    

                 if (i==19) {
                             socket.emit('player4.1',`${arr[i]}`);
                    }
                    else{
                          socket.emit('player4',`${arr[i]}`);
                    }
                 

            


        }   



        }



           

         socket.emit('playerturn',{id:1});


         let turnmove=0;

         socket.on('addstory',a=>{
           
           if (turnmove==0) {
             io.sockets.emit('addStoryInView',{storytext:a});
             turnmove++;
             return;
           }
           if (turnmove==1) {
             io.sockets.emit('addStoryInViewPlayertwo',{storytext:a});
             turnmove++;
             return;
           }

           if (turnmove==2) {
             io.sockets.emit('addStoryInViewPlayerthree',{storytext:a});
                     turnmove++;
                     return;
           }

            if (turnmove==3) {
             io.sockets.emit('addStoryInViewPlayerFour',{storytext:a});
                     turnmove++;
                     return;
           }

           else{
            console.log('turn out of bound'+turnmove);
           }


        

         

            //io.sockets.emit('addStoryInViewPlayertwo',{storytext:a});
           
         });

        socket.on('nextguess',()=>{
           
            io.sockets.emit('nextguess');
        
        });



         socket.on('nextguessmethod',()=>{
            
            io.sockets.emit('nextguessmethod');
        
        });

          socket.on('nextguessmethodplayertwo',()=>{
            
            io.sockets.emit('nextguessmethodplayertwo');
        
        });

           socket.on('nextguessmethodplayertwo1',()=>{
            
            io.sockets.emit('nextguessmethodplayertwo1');
        
        });

      socket.on('nextguessmethodplayerthree1',()=>{
            
            io.sockets.emit('nextguessmethodplayerthree1');
        
        });
      socket.on('nextguessmethodplayerthree2',()=>{
            
            io.sockets.emit('nextguessmethodplayerthree2');
        
        });
       socket.on('nextguessmethodplayerFour',()=>{
            
            io.sockets.emit('nextguessmethodplayerFour');
        
        });

       socket.on('nextguessmethodplayerFour2',()=>{
            
            io.sockets.emit('nextguessmethodplayerFour2');
        
        });



        

        socket.on('turnFirstPlayer',()=>{
        console.log('TurnFirstPlayer');
             io.sockets.emit('turnFirstPlayer');
        
        });

        socket.on('turnSecondPlayer',()=>{
        console.log('turnSecondPlayer');
             io.sockets.emit('turnSecondPlayer');
        
        });

         socket.on('turnThirdPlayer',()=>{
        console.log('turnThirdPlayer');
             io.sockets.emit('turnThirdPlayer');
        
        });

          socket.on('turnFourthPlayer',()=>{
        console.log('turnFourthPlayer');
             io.sockets.emit('turnFourthPlayer');
        
        });

       




         socket.on('hidestoryteller',()=>{
            

              io.sockets.emit('hidestoryteller');
              socket.emit('playerturn',{id:1});

        

             });


         socket.on('hidestoryteller2',()=>{
            
           
              io.sockets.emit('hidestoryteller2');
             // socket.emit('playerturn2',{id:1});

        

             });

          socket.on('hidestoryteller3',()=>{
            
          
              io.sockets.emit('hidestoryteller3');
             // socket.emit('playerturn2',{id:1});

        

             });


          socket.on('hidestoryteller4',()=>{
            
           
              io.sockets.emit('hidestoryteller4');
             // socket.emit('playerturn2',{id:1});

        

             });




    socket.on('hellosend', (output1) => {
           console.log('hellosend');
        })

          










    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username : socket.username})
    })


    socket.on('test-socket', testData=>{
        console.log(testData);
        io.emit('test-socket',testData)
    })
    




    
    
})}




module.exports={
    openSocket: socketIo,
    
}