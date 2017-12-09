var Task = require('./models/task.js');
var request = require('request');

var send = require('gmail-send')({
    user: 'nicks.list.reminder@gmail.com', 
    pass: 'DevBootCamp123',
    //to:   'daniel.seiser@gmail.com',
    subject: "Nick's List Notification"
    //text:    'gmail-send example 1'        //PLAIN TEXT
    //html:    '<b>You have been selected</b>'            // HTML 
  });

setInterval(sendEmails,1000*60*60*24)

function sendEmails(){
    console.log('mailer is running')
   Task.find({completeBy : {$lte: new Date()}, failureSent : {$ne : true}},function(err,res){
       for(i=0;i<res.length;i++){
           thisTask = res[i];
            Task.findByIdAndUpdate(thisTask['_id'],{failureSent : true},{new : true},function(err,newRes){
                console.log('updated ' + thisTask['_id']);
                send({//SEND EMAIL
                    to : thisTask.userEmail,
                    subject : "Nick's List Notification - You're a fucking failure!",
                    html : "<b>Dear " + thisTask.userFirst +' ' + thisTask.userLast + ",<br> You are a failure.</b><br>You did not complete your task: " + thisTask.name+ ".<br><a href='http://127.0.0.1:8080/'>Click Here to login</a> to Nick's List and continue sucking at life."})
            });
       }
   });
}