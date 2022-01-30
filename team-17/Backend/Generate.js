const AWS= require('aws-sdk'); 
const docClient = new AWS.DynamoDB.DocumentClient({region: 'ap-south-1'});
var otpno = Math.floor(Math.random() * 899999) + 100000;

exports.handler=function(event,context,callback)
{
    
         var inputmail="anandvihari150@gmail.com";
         var updateAttempt = {
                            TableName: "table3",
                              Key: {
                                     Email_ID: inputmail,
                                    },
                             UpdateExpression: "set Attempts_left =Attempts_left-:r",

                                   ExpressionAttributeValues: {
                                 ":r": 1,
                                     },
                         ReturnValues: "UPDATED_NEW",
                     };
        var scan ={
            TableName:'table3',
            Key: {
                Email_ID: inputmail
                  }
                 };
        docClient.get(scan,function(err,data){
            if(err){
                callback(err,null);
                  }
            else
                {
                    
                if(data.Item)
                   {
                    if(data.Item.Status=="verified")
                    {
                        console.log("your emailid is already verified");
                    }
                  else
                    if(data.Item.Attempts_left>0)
                    {
                        console.log("hello");
                      console.log("// sendig otp and updating attempts left");
                       
                     docClient.update(updateAttempt, function(err,data){
                         if(err)
                         {
                             console.log("update failed");
                         }
                         else
                         {
                             console.log("update successfull");
                         }
                     });
                      
                    }
                    else
                    {
                        console.log("your chances are over ");
                    }
                    }
                   
                 else
                {
                   
                    var params = {
                 Item: {
                         Email_ID:inputmail,
                         Otp:otpno,
                         Attempts_left:5,
                         Status:"not verified",
                        },
                      TableName: 'table3'
                                 };
                     docClient.put(params, function(err, data){
                      if(err){
                               callback(err,null);
                             }
                        else
                         {
                           callback(null,data);
                          }
        
                       });
                }
               }
                
            
            
        });
    
/*const sgmail = require('@sendgrid/mail');
//const express = require('express');
const APi_key = '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';

sgmail.setApiKey(APi_key)
var id="anandvihari150@gmail.com"

const message =
{
    to: `${id}`,
    from: 'tonystark1887717@gmail.com',
    subject: 'hello from tony',
    Text: `your otp for verification is  ${otpno}`
    // html: '<h1>hi</h1>'
};

sgmail.send(message)
    .then((response) => console.log('email sent'))
    .catch((error) => console.log('error'));*/
   /*
    });*/
};