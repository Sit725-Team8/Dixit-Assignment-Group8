//get the name from input filed
//wrap it in a package and sends it to the server
// const newPlayer = () => {
//     let text = $('#inputName').val()
//     console.log(text);
//     let data = {
//         name: text,
//         storyTold: 0,
//         stories: [],
//         score: 0
//     }
//     console.log(data);
//     $.ajax({
//         url: '/createProfile',
//         contentType: 'application/json',
//         data: JSON.stringify(data),
//         type: 'POST',
//         success: (result) => {
//             console.log(result);
//         }

//     })
// }
//testing socket functions 
var jq = $.noConflict();
    var socket = io.connect('http://localhost:3030')
    jq(function () {

      var topcon = jq("#topcon")
      var bottomcon = jq("#bottomcon")
      var rightcon = jq("#rightcon")
      var leftcon = jq("#leftcon")
      var storyteller1 = jq("#storyteller1")
      var story = jq("#story")
      var storyteller2 = jq("#storyteller2")



      socket.on('player1', id => {
        //  console.log(id); 
        topcon.append(`<div class="card centercontent" 
                style="background-image: url('/images/${id}.png');
                background-size: cover;position: center;
                "></div>`);
      });


      socket.on('player2', id => {
        //  console.log(id); 
        bottomcon.append(`<div class="card centercontent" 
                style="background-image: url('/images/${id}.png');
                background-size: cover;position: center;
                "></div>`);
      });

      let count = 0;

      if (count == 0) {
        socket.on('player3.1', id => {
          //  console.log(id); 
          rightcon.append(` <div class="card centercontent card2" 
        style="background-image: url('/images/${id}.png');
        background-size: cover;border: 1px solid white;
        "></div>`);
        });
        count++;
      }

      socket.on('player3', id => {
        //  console.log(id); 
        rightcon.append(`  <div class="card centercontent card2" 
      style="background-image: url('/images/${id}.png');
    background-size: cover;margin-top:-50%;border: 1px solid white; ;
      "></div>`);
      });


      let count2 = 0;

      if (count2 == 0) {
        socket.on('player4.1', id => {
          //  console.log(id); 
          leftcon.append(` <div class="card centercontent card2" 
        style="background-image: url('/images/${id}.png');
        background-size: cover;border: 1px solid white;
        "></div>`);
        });
        count2++;
      }

      socket.on('player4', id => {
        //  console.log(id); 
        leftcon.append(`  <div class="card centercontent card2" 
      style="background-image: url('/images/${id}.png');
    background-size: cover;margin-top:-50%;border: 1px solid white; ;
      "></div>`);
      });




      socket.on('playerturn', id => {
        //  console.log(id);

        //  console.log(id); 
        storyteller1.append(`<button 
        style="padding: 10px 20px;background:green;color: white;border: none;border-radius: 5px ;"
         value=${id}
         id="myBtn1">
          Tell Story
        </button>`);


      });

    });




    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    //var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // Get the modal

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];




    jq(document).on('click', '#myBtn1', function () {
      modal.style.display = "block";
    });


    jq(document).on('click', '#myBtn3', function () {
      modal.style.display = "block";
    });


    jq(document).on('click', '#myBtn', function () {
      modal.style.display = "block";
    });


    let numberofturn = 0;


    jq(document).on('click', '#done', function () {

      let a = document.getElementsByTagName('input')[0].value;
      socket.emit('addstory', a);
      

    });



    jq(document).on('click', '#guess2', function () {

      socket.emit('nextguess');
    });



    jq(document).on('click', '#guess3', function () {

      socket.emit('nextguessmethod');
    });


    jq(document).on('click', '#guessplayertwo', function () {

      socket.emit('nextguessmethodplayertwo');
    });

    jq(document).on('click', '#guessplayerthree3', function () {

      socket.emit('nextguessmethodplayerthree1');
    });

    jq(document).on('click', '#guessplayerthree1', function () {

      socket.emit('nextguessmethodplayerthree2');
    });


    jq(document).on('click', '#guessplayertwo1', function () {

      socket.emit('nextguessmethodplayertwo1');
    });



    jq(document).on('click', '#guessplayerfour1', function () {

      socket.emit('nextguessmethodplayerFour');
    });


    jq(document).on('click', '#guessplayerfour2', function () {

      socket.emit('nextguessmethodplayerFour2');
    });


    jq(document).on('click', '#guess4', function () {



      socket.emit('turnFirstPlayer');
    });



    jq(document).on('click', '#guessplayerthree2', function () {

      socket.emit('turnThirdPlayer');
    });

    //

    jq(document).on('click', '#guessplayerfour3', function () {

      socket.emit('turnFourthPlayer');
    });


    jq(document).on('click', '#guessplayerthree2', function () {

      socket.emit('turnThirdPlayer');
    });


    jq(document).on('click', '#guessplayertwo2', function () {

      socket.emit('turnSecondPlayer');
    });



    socket.on('addStoryInView', a => {

      //  document.getElementById('story').innerText="Find : "+a.storytext;

      story.append(`Story :  ${a.storytext}`);

      socket.emit('hidestoryteller');
      modal.style.display = "none";
      var element = document.getElementById("guess2");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");

    });



    socket.on('addStoryInViewPlayertwo', a => {


      //  document.guess2etElementById('story').innerText="Find : "+a.storytext;
      modal.style.display = "none";

      document.getElementById('story').innerText = "";
      story.append(`Story :  ${a.storytext}`);


      socket.emit('hidestoryteller2');

      var element = document.getElementById("guessplayertwo");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");

    });



    socket.on('addStoryInViewPlayerthree', a => {


      modal.style.display = "none";

      document.getElementById('story').innerText = "";
      story.append(`Story :  ${a.storytext}`);


      socket.emit('hidestoryteller3');

      var element = document.getElementById("guessplayerthree3");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");

    });


    socket.on('addStoryInViewPlayerFour', a => {

      alert('addStoryInViewPlayerFour');
      //  document.guess2etElementById('story').innerText="Find : "+a.storytext;
      modal.style.display = "none";

      document.getElementById('story').innerText = "";
      story.append(`Story :  ${a.storytext}`);


      socket.emit('hidestoryteller4');

      var element = document.getElementById("guessplayerfour1");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");

    });















    socket.on('nextguess', () => {
      var element = document.getElementById("guess2");
      element.classList.remove("activebtn");
      var element = document.getElementById("guess3");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");

    })


    socket.on('nextguessmethod', () => {
      var element = document.getElementById("guess3");
      element.classList.remove("activebtn");
      var element = document.getElementById("guess4");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");

    })

    //


    socket.on('nextguessmethodplayertwo', () => {

      var element = document.getElementById("guessplayertwo");
      element.classList.remove("activebtn");

      var element = document.getElementById("guessplayertwo1");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");


    })

    socket.on('nextguessmethodplayerthree1', () => {

      var element = document.getElementById("guessplayerthree3");
      element.classList.remove("activebtn");

      var element = document.getElementById("guessplayerthree1");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");


    })

    socket.on('nextguessmethodplayerthree2', () => {

      var element = document.getElementById("guessplayerthree1");
      element.classList.remove("activebtn");

      var element = document.getElementById("guessplayerthree2");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");


    })

    socket.on('nextguessmethodplayertwo1', () => {

      var element = document.getElementById("guessplayertwo1");
      element.classList.remove("activebtn");

      var element = document.getElementById("guessplayertwo2");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");


    })

    socket.on('nextguessmethodplayerFour', () => {

      var element = document.getElementById("guessplayerfour1");
      element.classList.remove("activebtn");

      var element = document.getElementById("guessplayerfour2");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");


    })

    socket.on('nextguessmethodplayerFour2', () => {

      var element = document.getElementById("guessplayerfour2");
      element.classList.remove("activebtn");
      var element = document.getElementById("guessplayerfour3");
      element.classList.remove("offscreen");
      element.classList.add("activebtn");


    })



    socket.on('turnFirstPlayer', () => {
      var element = document.getElementById("guess4");
      element.classList.remove("offscreen");
      element.classList.remove("activebtn");

      document.getElementById('guess1').style.display = "none";
      document.getElementById('guess2').style.display = "none";
      document.getElementById('guess3').style.display = "none";
      document.getElementById('guess4').style.display = "none";

      document.getElementById('storyteller2').style.display = "block";




    })


    socket.on('turnSecondPlayer', () => {

      var element = document.getElementById("guessplayertwo2");
      element.classList.remove("offscreen");
      element.classList.remove("activebtn");

      document.getElementById('guessplayertwo').style.display = "none";
      document.getElementById('guessplayertwo1').style.display = "none";
      document.getElementById('guessplayertwo2').style.display = "none";
      // document.getElementById('guess4').style.display="none";

      document.getElementById('storyteller3').style.display = "block";




    })



    socket.on('turnThirdPlayer', () => {

      var element = document.getElementById("guessplayerthree2");
      element.classList.remove("offscreen");
      element.classList.remove("activebtn");

      document.getElementById('guessplayerthree2').style.display = "none";
      document.getElementById('guessplayerthree1').style.display = "none";
      document.getElementById('guessplayerthree3').style.display = "none";
      // document.getElementById('guess4').style.display="none";

      document.getElementById('storyteller').style.display = "block";
    })


    socket.on('turnFourthPlayer', () => {

      var element = document.getElementById("guessplayerfour3");
      element.classList.remove("offscreen");
      element.classList.remove("activebtn");

      document.getElementById('guessplayerfour3').style.display = "none";
      document.getElementById('guessplayerfour2').style.display = "none";
      document.getElementById('guessplayerfour1').style.display = "none";
      // document.getElementById('guess4').style.display="none";

      //   document.getElementById('storyteller').style.display="block";

      alert('Game Ended');



    })




    socket.on('hidestoryteller', () => {

      document.getElementById('storyteller1').style.display = "none";
    })


    socket.on('hidestoryteller2', () => {


      document.getElementById('storyteller2').style.display = "none";

    })


    socket.on('hidestoryteller3', () => {
      console.log('now hidding three');
      alert('we reach at three');
      document.getElementById('storyteller3').style.display = "none";

    })


    socket.on('hidestoryteller4', () => {
      document.getElementById('storyteller').style.display = "none";

    })





    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }