"use strict";

console.log("Loading function");
const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });

exports.handler = function (event, context, callback) {
  let body = event;
  let email = body.Email;
  let OTP = body.OTP;

  var updateParamsVerified = {
    TableName: "First-Table",
    Key: {
      Email: email,
    },
    UpdateExpression: "set isVerified = :r, tries=tries -:p",

    ExpressionAttributeValues: {
      ":r": 1,
      ":p": 1,
    },
    ReturnValues: "UPDATED_NEW",
  };

  var updateParamsNotVerified = {
    TableName: "First-Table",
    Key: {
      Email: email,
    },
    UpdateExpression: "set isVerified = :r, tries=tries -:p",

    ExpressionAttributeValues: {
      ":r": 0,
      ":p": 1,
    },
    ReturnValues: "UPDATED_NEW",
  };

  /*  var PutparamsNotVerified={
               
               Item:{
                   
                   "Email": email,
                   "isVerified": 0,
                   "tries": 3
               },
               TableName: "First-Table"
           }*/

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
      if (data.Item.OTP == OTP) {
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
  });
};
