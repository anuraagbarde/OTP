"use strict";

console.log("Loading function");
const AWS = require("aws-sdk");
import { API_KEY } from "./API_keys";
import { tableName } from "./API_keys";
const sgMail = require("@sendgrid/mail");
const otpGenerator = require("otp-generator");

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });

//Function to fetch the present date w.r.t EPOCH
let Datenow = Date.now();
function getDate() {
  return Date.now();
}

//Defines the expiry time
let expiryTime = getDate() + 180000;

//Generates OTP using the OTP generator node package
const OTP = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
});

//Adding the API key of sendgrid
sgMail.setApiKey(API_KEY);

//function to send the mail using sendgrid
function sendMail() {
  return sgMail.send(message);
}

//Defining the response parameters
let responseBody = "";
let statusCode = 0;

//Handler function of AWS lambda
exports.handler = (event, context, callback) => {
  let body = event;
  let { email } = body;

  //Defining the verification Email parameters
  const message = {
    to: email,
    from: {
      name: "noobMaster69",
      email: "djokernovak7@gmail.com",
    },
    subject: "Email Verification Request",
    text: `Your One Time Password (OTP) for Email verification is: ${OTP}`,
    html: `<p>Your One Time Password (OTP) for Email verification is: <span styles="text-style: bold"></span>${OTP}</span></p>`,
  };

  // DynamoDB: parameters to be updated if the verification mail is sent.
  const updateParams = {
    TableName: tableName,
    Key: {
      Email: email,
    },
    UpdateExpression: "set OTP=:r, tries = tries+:p, expiryTime=:q",

    ExpressionAttributeValues: {
      ":r": OTP,
      ":p": 1,
      ":q": expiryTime,
    },
    ReturnValues: "UPDATED_NEW",
  };
  // DynamoDB: parameters to be fetched according to the input email
  const getParams = {
    Key: {
      Email: email,
    },
    TableName: tableName,
  };
  // DynamoDB: parameters to be Added, when the use is new
  const Putparams = {
    Item: {
      Email: email,
      OTP: OTP,
      isVerified: 0,
      tries: 3,
      expiryTime: expiryTime,
    },
    TableName: tableName,
  };

  //Fetch the details of the user Email from the DynamoDB
  const data = docClient.get(getParams, (err, data) => {
    if (err) {
      console.log(err);
    }
    //If email exits in DynamoDB
    else {
      if (data.Item) {
        //If the Email if already verified
        if (data.Item.isVerified) {
          responseBody = `Your Email has already been verified..!`;
          //Defining response parameters
          statusCode = 400;
          //Response to be sent to the user
          const response = {
            statusCode: statusCode,
            headers: {
              my_header: "my_value",
            },
            body: JSON.stringify(responseBody),
            isBase64Encoded: false,
          };
          callback(null, response); //Sending the response to the user
        }
        //If Email exists and the number of attempts of the user are within the limit
        else {
          if (data.Item.tries < 3) {
            const data = sendMail();
            docClient.update(updateParams, (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Details updated successfully");
              }
            });
            //Defining response parameters
            responseBody = `An OTP has been mailed to you for verification..!`;
            statusCode = 200;
            //Response to be sent to the user
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(null, response); //Sending the response to the user
          }
          //If the number of attempts of the user are exceeded
          else {
            //Defining response parameters
            responseBody = `Number of tries for verification has been exceeded..!`;
            statusCode = 200;
            //Response to be sent to the user
            const response = {
              statusCode: statusCode,
              headers: {
                my_header: "my_value",
              },
              body: JSON.stringify(responseBody),
              isBase64Encoded: false,
            };
            callback(null, response); //Sending the response to the user
          }
        }
      }
      //If the user is new (The record the user is not present in DynamoDB)
      else {
        const data = sendMail();
        docClient.put(Putparams, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Details appended successfully");
          }
        });
        //Defining response parameters
        responseBody = `An OTP has been mailed to you for verification..!`;
        statusCode = 201;
        //Response to be sent to the user
        const response = {
          statusCode: statusCode,
          headers: {
            my_header: "my_value",
          },
          body: JSON.stringify(responseBody),
          isBase64Encoded: false,
        };

        callback(null, response); //Sending the response to the user
      }
    }
  });
};
