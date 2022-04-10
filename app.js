const express = require("express");
const mongoose = require("mongoose");
const {Police, Doctor, Ttr} = require("./models/schema");
const {Passenger} = require("./models/passengerSchema");
const cookieParser = require("cookie-parser");
var nodemailer = require('nodemailer');
const VoiceResponse = require('twilio').twiml.VoiceResponse;


const accountSid = "AC095d18b989323d0de23f9427759025c5";
const authToken = "39fe572c38a70c8a9eea33fe0f3c5b57";
const client = require('twilio')(accountSid, authToken);

const MessagingResponse = require('twilio').twiml.MessagingResponse;




const Vonage = require('@vonage/server-sdk');
const privateKey = require('fs').readFileSync("./private.key");

const vonage = new Vonage({
  apiKey: "ca0ebaf7",
  apiSecret: "7ymQkFYulAn9XBIM",
  applicationId: "e162e81f-4b51-49d7-a704-c8a48ce8d464",
  privateKey: privateKey
});




const app = express();
app.use(cookieParser());
var details;
var assist = "";

const url = "mongodb+srv://JSoorajKrishna:12345@pollbooth.cgszb.mongodb.net/AccentureHackathon?retryWrites=true&w=majority";

app.listen(1337);





app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
        .then((result) => console.log("Connected to the database"))
        .catch((err) => console.log(err));

app.get("/",(req,res) =>{
    res.render("index");
});

app.get("/credentials",(req,res) =>{
    res.render("credentials");
});

app.post("/",(req,res) =>{
    let j=0;
    details = req.body;
    Passenger.find()
            .then((result) =>{
                for(let i=0;i<result.length;i++)
                {
                    if(result[i].mobileNumber == details.mobileNumber)
                    {
                        res.cookie("login","true");
                        if(details.complaint == "Complaint")
                        res.redirect("/complaint");
                        else
                        res.redirect("/medicalEmergency");
                        j++;
                        details = result[i];
                    }
                }
                if(j==0)
                res.redirect("/credentials");
            })
            .catch(err => console.log(err));
});


app.get("/medicalEmergency",(req,res) =>{
    if(req.cookies.login)
    {
        let temp1;
        Doctor.find()
            .then((result) =>{
                temp1 = result;


            let temp2;
            Ttr.find()
            .then((result2) =>{
                temp2 = result2;

                let temp3;
                Police.find()
                .then((result3) =>{
                    temp3 = result3;
                    res.render("medical",{ doctor: temp1, ttr: temp2, police: temp3});
                })
                .catch(err => console.log(err));

                


            })
            .catch(err => console.log(err));



            })
            .catch(err => console.log(err));



        assist = "Medical";
        assistance();        
    }
    else{
        res.redirect("/credentials");
    }

});

app.get("/complaint",(req,res) =>{
    if(req.cookies.login)
    {
        let temp1;
        Police.find()
            .then((result) =>{
                temp1 = result;

            let temp2;
            Ttr.find()
            .then((result2) =>{
                temp2 = result2;
                res.render("complaint",{ police: temp1, ttr: temp2});
            })
            .catch(err => console.log(err));


            })
            .catch(err => console.log(err));

        


        assist = "Police";
        assistance();
        
    }
    else{
        res.redirect("/credentials");
    }
});


app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();

    console.log("SMS Received");

    // console.log(req.body.From);


    details = req.body.From;
    // details = details.toString();
    details = details.slice(1,13);
    details = parseInt(details);



    // console.log(req);

    // console.log("-------------------------");

    // console.log(req.body);

    // console.log("-------------------------");


    // console.log(req.body.Payload);
    // var obj = JSON.parse(req.body.Payload);

    // console.log("-------------------------");
    // console.log(obj);

    // details = req.body.WaId;
    // details = parseInt(details);
    Passenger.find()
            .then((result) =>{
                for(let i=0;i<result.length;i++)
                {
                    if(result[i].mobileNumber == details)
                    {
                        details = result[i];
                        console.log("SMS Received");
                        assistance();
                    }
                }
            })
            .catch(err => console.log(err));


    
    if(req.body.Body == "Medical")
    {
        assist = "Medical";
    }
    else
    {
        assist = "Police";
    }
    // assistance();

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Request received');
  });



  app.post('/whatsapp', (req, res) => {
    const twiml = new MessagingResponse();
    console.log("Whatsapp Message Received");

    details = req.body.WaId;
    details = parseInt(details);
    Passenger.find()
            .then((result) =>{
                for(let i=0;i<result.length;i++)
                {
                    if(result[i].mobileNumber == details)
                    {
                        details = result[i];
                        console.log("Whatsapp Message Received");
                        assistance();
                    }
                }
            })
            .catch(err => console.log(err));


    
    if(req.body.Body == "Medical")
    {
        assist = "Medical";
    }
    else
    {
        assist = "Police";
    }
    // assistance();

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Request received');
  });


app.post('/voice', (request, response) => {
  const twiml = new VoiceResponse();
  console.log("Phone call received");

  details = request.body.From;
  details = details.slice(1,13);
    details = parseInt(details);
    Passenger.find()
            .then((result) =>{
                for(let i=0;i<result.length;i++)
                {
                    if(result[i].mobileNumber == details)
                    {
                        details = result[i];
                        console.log("Phone call received");
                        assistance();
                    }
                }
            })
            .catch(err => console.log(err));



  assist = "Police";
//   assistance();

  response.type('text/plain');
  response.send("Request received");
});




app.use((req,res) =>{
    res.send("404 page");
});


let assistance = function()
{
    //message to the passenger

    if(assist == "Medical")
    {
            client.messages
        .create({
            body: 'Your request has been accepted. Go to the link given below to get the contact details of the TTR, Police and Doctor. http://localhost:3000/medicalEmergency',
            from: '+18886920045',
            to: details.mobileNumber
        })
        .then(message => console.log(message.sid));

    }
    else{
            client.messages
        .create({
            body: 'Your request has been accepted. Go to the link given below to get the contact details of the TTR and Police. http://localhost:3000/complaint',
            from: '+18886920045',
            to: details.mobileNumber
        })
        .then(message => console.log(message.sid));
    }






    // sending mail


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'accenturehackathon2021@gmail.com',
          pass: 'AccentureHackathon2021'
        }
      });
      
      var mailOptions = {
        from: 'accenturehackathon2021@gmail.com',
        to: 'accenturehackathon2021@gmail.com',
        subject: `Need ${assist} assistance`,
        text: `The passenger needs immediate ${assist} assistance. Name: ${details.name}, Mobile Number: ${details.mobileNumber}, Coach: ${details.coach}, Birth Number: ${details.birthNumber}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });







//     //text message
    
    Police.find()
        .then((result) =>{
            for(let i=0;i<result.length;i++)
            {
                    
                    const from = "Vonage APIs";
                    const to = `${result[i].mobileNumber}`;
                    const text = `The passenger needs immediate ${assist} assistance. Name: ${details.name}, Mobile Number: ${details.mobileNumber}, Coach: ${details.coach}, Birth Number: ${details.birthNumber}`;

                    vonage.message.sendSms(from, to, text, (err, responseData) => {
                        if (err) {
                            console.log(err);
                        } else {
                            if(responseData.messages[0]['status'] === "0") {
                                console.log("Message sent successfully.");
                                console.log(text);
                            } else {
                                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                            }
                        }
                    });


            }
                })
        .catch(err => console.log(err));

        // if(assist == "Medical")
        // {
        //         Doctor.find()
        //         .then((result) =>{
        //             for(let i=0;i<result.length;i++)
        //             {
                            
        //                     const from = "Vonage APIs";
        //                     const to = `${result[i].mobileNumber}`;
        //                     const text = `The passenger needs immediate ${assist} assistance. Name: ${details.name}, Mobile Number: ${details.mobileNumber}, Coach: ${details.coach}, Birth Number: ${details.birthNumber}`;

        //                     vonage.message.sendSms(from, to, text, (err, responseData) => {
        //                         if (err) {
        //                             console.log(err);
        //                         } else {
        //                             if(responseData.messages[0]['status'] === "0") {
        //                                 console.log("Message sent successfully.");
        //                                 console.log(text);
        //                             } else {
        //                                 console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        //                             }
        //                         }
        //                     });


        //             }
        //                 })
        //         .catch(err => console.log(err));
        //     }


        // Ttr.find()
        // .then((result) =>{
        //     for(let i=0;i<result.length;i++)
        //     {
                    
        //             const from = "Vonage APIs";
        //             const to = `${result[i].mobileNumber}`;
        //             const text = `The passenger needs immediate ${assist} assistance. Name: ${details.name}, Mobile Number: ${details.mobileNumber}, Coach: ${details.coach}, Birth Number: ${details.birthNumber}`;

        //             vonage.message.sendSms(from, to, text, (err, responseData) => {
        //                 if (err) {
        //                     console.log(err);
        //                 } else {
        //                     if(responseData.messages[0]['status'] === "0") {
        //                         console.log("Message sent successfully.");
        //                         console.log(text);
        //                     } else {
        //                         console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        //                     }
        //                 }
        //             });


        //     }
        //         })
        // .catch(err => console.log(err));









//voice call



// Ttr.find()
//         .then((result) =>{
//             for(let i=0;i<result.length;i++)
//             {
                    
//                 vonage.calls.create({
//                     to: [{
//                       type: 'phone',
//                       number: `${result[i].mobileNumber}`
//                     }],
//                     from: {
//                       type: 'phone',
//                       number: "917904283398"
//                     },
//                     ncco: [{
//                       "action": "talk",
//                       "text": `The passenger at the coach ${details.coach} and the birth ${details.birthNumber} needs ${assist} assistance. The details of the passenger has been messaged to you. Kindly check the message and assist the passenger`
//                     }]
//                   }, (error, response) => {
//                     if (error) console.error(error)
//                     if (response) console.log(response)
//                   });



//             }
//                 })
//         .catch(err => console.log(err));


        Police.find()
        .then((result) =>{
            for(let i=0;i<result.length;i++)
            {
                    
                vonage.calls.create({
                    to: [{
                      type: 'phone',
                      number: `${result[i].mobileNumber}`
                    }],
                    from: {
                      type: 'phone',
                      number: "917904283398"
                    },
                    ncco: [{
                      "action": "talk",
                      "text": `The passenger at the coach ${details.coach} and the birth ${details.birthNumber} needs ${assist} assistance. The details of the passenger has been messaged to you. Kindly check the message and assist the passenger`
                    }]
                  }, (error, response) => {
                    if (error) console.error(error)
                    if (response) console.log(response)
                  });



            }
                })
        .catch(err => console.log(err));


        // if(assist == "Medical")
        // {
        //     Doctor.find()
        //     .then((result) =>{
        //         for(let i=0;i<result.length;i++)
        //         {
                        
        //             vonage.calls.create({
        //                 to: [{
        //                 type: 'phone',
        //                 number: `${result[i].mobileNumber}`
        //                 }],
        //                 from: {
        //                 type: 'phone',
        //                 number: "917904283398"
        //                 },
        //                 ncco: [{
        //                 "action": "talk",
        //                 "text": `The passenger at the coach ${details.coach} and the birth ${details.birthNumber} needs ${assist} assistance. The details of the passenger has been messaged to you. Kindly check the message and assist the passenger`
        //                 }]
        //             }, (error, response) => {
        //                 if (error) console.error(error)
        //                 if (response) console.log(response)
        //             });



        //         }
        //             })
        //     .catch(err => console.log(err));
        // }




// // vonage.calls.create({
// //     to: [{
// //       type: 'phone',
// //       number: "917904283398"
// //     }],
// //     from: {
// //       type: 'phone',
// //       number: "917904283398"
// //     },
// //     ncco: [{
// //       "action": "talk",
// //       "text": `The passenger at the coach ${details.coach} and the birth ${details.birthNumber} needs ${assist} assistance. The details of the passenger has been messaged to you. Kindly check the message and assist the passenger`
// //     }]
// //   }, (error, response) => {
// //     if (error) console.error(error)
// //     if (response) console.log(response)
// //   });

}