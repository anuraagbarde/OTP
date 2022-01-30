"use strict";

console.log("Loading function");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });

let Datenow = Date.now();

function getDate() {
  return Date.now();
}

let responseBody = "";
let statusCode = 0;

exports.handler = function (event, context, callback) {
  let body = event;
  let email = body.email;
  let OTP = body.OTP;

  var updateParamsVerified = {
    TableName: "First-Table",
    Key: {
      Email: email,
    },
    UpdateExpression: "set isVerified = :r",

    ExpressionAttributeValues: {
      ":r": 1,
    },
    ReturnValues: "UPDATED_NEW",
  };

  var updateParamsNotVerified = {
    TableName: "First-Table",
    Key: {
      Email: email,
    },
    UpdateExpression: "set isVerified = :r",

    ExpressionAttributeValues: {
      ":r": 0,
    },
    ReturnValues: "UPDATED_NEW",
  };

  var Scanparams = {
    Key: {
      Email: email,
    },
    TableName: "First-Table",
  };

  console.log(getDate());

  const data = docClient.get(Scanparams, (err, data) => {
    if (err) {
      callback(err);
    } else {
      if (data.Item.OTP == OTP && data.Item.expiryTime > getDate()) {
        docClient.update(updateParamsVerified, (err, data) => {
          if (err) {
            responseBody = `Error: ${err}`;
            statusCode = 402;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(response, null);
          } else {
            console.log("Details Updated succesfully..!");
            responseBody = `You have been verified succesfully..!`;
            statusCode = 200;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(null, response);
          }
        });
      } else if (getDate() > data.Item.expiryTime) {
        docClient.update(updateParamsNotVerified, (err, data) => {
          if (err) {
            responseBody = `Error: ${err}`;
            statusCode = 402;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(response, null);
          } else {
            console.log("Details Updated succesfully..!");
            responseBody = `OTP Expired..!`;
            statusCode = 400;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(null, response);
          }
        });
      } else {
        docClient.update(updateParamsNotVerified, (err, data) => {
          if (err) {
            responseBody = `Error: ${err}`;
            statusCode = 402;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(response, null);
          } else {
            console.log("Details Updated succesfully..!");
            responseBody = `Wrong OTP..!`;
            statusCode = 400;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(null, response);
          }
        });
      }
    }
  });
};

/* Jan - 30

"use strict";

console.log("Loading function");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });

let Datenow = Date.now();

function getDate() {
  return Date.now();
}

let responseBody = "";
let statusCode = 0;

exports.handler = function (event, context, callback) {
  let body = event;
  let email = body.Email;
  let OTP = body.OTP;

  var updateParamsVerified = {
    TableName: "First-Table",
    Key: {
      Email: email,
    },
    UpdateExpression: "set isVerified = :r",

    ExpressionAttributeValues: {
      ":r": 1,
    },
    ReturnValues: "UPDATED_NEW",
  };

  var updateParamsNotVerified = {
    TableName: "First-Table",
    Key: {
      Email: email,
    },
    UpdateExpression: "set isVerified = :r",

    ExpressionAttributeValues: {
      ":r": 0,
    },
    ReturnValues: "UPDATED_NEW",
  };

  var Scanparams = {
    Key: {
      Email: email,
    },
    TableName: "First-Table",
  };

  const data = docClient.get(Scanparams, (err, data) => {
    if (err) {
      callback(err);
    } else {
      if (data.Item.OTP == OTP && data.Item.expiryTime > getDate()) {
        docClient.update(updateParamsVerified, (err, data) => {
          if (err) {
            responseBody = `Error: ${err}`;
            statusCode = 402;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(response, null);
          } else {
            console.log("Details Updated succesfully..!");
            responseBody = `You have been verified succesfully..!`;
            statusCode = 200;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(null, response);
          }
        });
      } else if (getDate() > data.Item.expiryTime) {
        docClient.update(updateParamsNotVerified, (err, data) => {
          if (err) {
            responseBody = `Error: ${err}`;
            statusCode = 402;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(response, null);
          } else {
            console.log("Details Updated succesfully..!");
            responseBody = `OTP Expired..!`;
            statusCode = 400;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(null, response);
          }
        });
      } else {
        docClient.update(updateParamsNotVerified, (err, data) => {
          if (err) {
            responseBody = `Error: ${err}`;
            statusCode = 402;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(response, null);
          } else {
            console.log("Details Updated succesfully..!");
            responseBody = `Wrong OTP..!`;
            statusCode = 400;
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(null, response);
          }
        });
      }
    }
  });
};
 */
/* const data = docClient.get(Scanparams, (err, data) => {
    if (err) {
      callback(err);
    } else {
      if (data.Item.OTP == OTP && data.Item.expiryTime < getDate()) {
        docClient.update(updateParamsVerified, function (err, data) {
          if (err) {
            console.error(
              "Unable to update item. Error JSON:",
              JSON.stringify(err, null, 2)
            );
          } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          }
        });
        callback(null, "Verified Succesfully");
      } else {
        docClient.update(updateParamsNotVerified, function (err, data) {
          if (err) {
            console.error(
              "Unable to update item. Error JSON:",
              JSON.stringify(err, null, 2)
            );
          } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          }
        });

        callback(null, "Wrong OTP");
      }
    }
  }); */

/*  'use strict';

console.log('Loading function');
const AWS = require('aws-sdk');


const docClient=new AWS.DynamoDB.DocumentClient({region: 'us-east-2'});


exports.handler = function(event,context,callback){
    
    let body = event;
    let email=body.Email;
    let OTP=body.OTP;
    
    var updateParamsVerified={
               
               TableName: "First-Table",
               Key: {
                   "Email": email},
               UpdateExpression: "set isVerified = :r, tries=tries -:p",
           
           ExpressionAttributeValues: {
               ":r": 1,
               ":p": 1
               
           },
        ReturnValues:"UPDATED_NEW"
    }
    
    var updateParamsNotVerified={
               
               TableName: "First-Table",
               Key: {
                   "Email": email},
               UpdateExpression: "set isVerified = :r, tries=tries -:p",
           
           ExpressionAttributeValues: {
               ":r": 0,
               ":p": 1
               
           },
        ReturnValues:"UPDATED_NEW"
    }
           
         /*  var PutparamsNotVerified={
               
               Item:{
                   
                   "Email": email,
                   "isVerified": 0,
                   "tries": 3
               },
               TableName: "First-Table"
           }
    
           
          
    var Scanparams={
               
               Key:{
                    "Email": email 
                },
               TableName: "First-Table"
           }
           
            const data= docClient.get(Scanparams,(err,data)=>{
              if (err) {
                 callback(err)
              }
              else{
                  if(data.Item.OTP==OTP){
                      docClient.update(updateParamsVerified, function(err, data) {
                                if (err) {
                                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                                } else {
                                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                                }
                            });
                  callback(null,"Verified Succesfully")
                      
                  }
                  else{
                      docClient.update(updateParamsNotVerified, function(err, data) {
                                if (err) {
                                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                                } else {
                                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                                }
                            });
                      
                      callback(null,"Wrong OTP")
                  }
                  
              }
              
          
          })
} */
