require("dotenv").config();
const express=require('express');
const app=express();
const request=require('request');
const bodyParser = require('body-parser');
const https=require('https');



app.listen(process.env.PORT || 3000,function(){
  console.log("Server is listening.");
})

app.use(bodyParser.urlencoded({
    extended: true
}));


//CSS was not working before adding this line
app.use(express.static(__dirname));


app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});


app.post("/failure",function(req,res){
  res.redirect("/");
});


app.post("/",function(req,res){
  const fName=req.body.firstName;
  const lName=req.body.lastName;
  const email=req.body.emailId;

  const data={
    members:[
      {
      email_address:email,
      status:"subscribed",
      merge_fields:{
        FNAME:fName,
        LNAME:lName
      }
    }
    ]

  };
  const jsonData=JSON.stringify(data);
  const url=process.env.URL;
  const options={
    method:"POST",
    auth:process.env.AUTH
  }
  const request=https.request(url,options,function(response){
    if(response.statusCode==200&&response.error_count==0)
    {
      res.sendFile(__dirname+"/success.html");
    }
    else {
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      var parsedData=JSON.parse(data);
    })
  });
  request.write(jsonData);
  request.end();

});
 //console.log(x);


// API key
// 492ff904cd30716a16558c4691c5d06e-us6
//List id / audience id
// 17ee375ba8
