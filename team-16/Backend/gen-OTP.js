("use strict");

console.log("Loading function");
const AWS = require("aws-sdk");
const express = require("express");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2Client, DefaultTransporter } = require("google-auth-library");
const hbs = require("nodemailer-express-handlebars");
const emailValidator = require("email-validator");

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });
const tableName = "";

const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REDIRECT_URI = "";
const REFRESH_TOKEN = "";

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//Function to fetch the present date w.r.t EPOCH
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

//Defining the response parameters
let responseBody = "";
let statusCode = 0;

//Handler function of AWS lambda
exports.handler = (event, context, callback) => {
  let body = event;
  let { email } = body;

  if (!emailValidator.validate(email)) {
    responseBody = `Invalid email..!`;
    //Defining response parameters
    statusCode = 400;
    //Response to be sent to the user
    const response = {
      statusCode: statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
      body: JSON.stringify(responseBody),
      isBase64Encoded: false,
    };
    callback(null, response); //Sending the response to the user
  }

  async function sendMail() {
    try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true, // true for 465, false for other ports
        logger: true,
        debug: true,
        secureConnection: false,
        auth: {
          type: "OAuth2",
          user: "djokernovak7@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
        tls: {
          rejectUnAuthorized: true,
        },
      });

      const handlebarOptions = {
        viewEngine: {
          extName: ".handlebars",
          partialsDir: "./views",
          defaultLayout: false,
        },
        viewPath: "./views",
        extName: ".handlebars",
      };

      console.log(transport.options.host);
      transport.use("compile", hbs(handlebarOptions));

      const mailOptions = {
        from: "noobMaster69 <djokernovak7@gmail.com>",
        to: email,
        subject: "Email Verification Request",
        text: "Hey there..!",
        template: "index",
        context: {
          OTP: OTP,
        },
      };

      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }

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
      tries: 0,
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
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST",
            },
            body: JSON.stringify(responseBody),
            isBase64Encoded: false,
          };
          callback(null, response); //Sending the response to the user
        }
        //If Email exists and the number of attempts of the user are within the limit
        else {
          if (data.Item.tries < 5) {
            sendMail()
              .then((result) => console.log("Email Sent..!", result))
              .catch((error) => console.log("Error: ", error.message));
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
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
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
            statusCode = 201;
            //Response to be sent to the user
            const response = {
              statusCode: statusCode,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST",
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
        sendMail()
          .then((result) => console.log("Email Sent..!", result))
          .catch((error) => console.log("Error: ", error.message));
        docClient.put(Putparams, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Details appended successfully");
          }
        });
        //Defining response parameters
        responseBody = `An OTP has been mailed to you for verification..!`;
        statusCode = 200;
        //Response to be sent to the user
        const response = {
          statusCode: statusCode,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
          },
          body: JSON.stringify(responseBody),
          isBase64Encoded: false,
        };

        callback(null, response); //Sending the response to the user
      }
    }
  });
};
