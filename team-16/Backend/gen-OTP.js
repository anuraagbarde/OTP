"use strict";

console.log("Loading function");
const API_KEY =
  "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";
const AWS = require("aws-sdk");
const sgMail = require("@sendgrid/mail");
const otpGenerator = require("otp-generator");

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });

const OTP = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
});

exports.handler = (event, context, callback) => {
  sgMail.setApiKey(API_KEY);
  let body = event;
  let { email } = body;

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

  function sendMail() {
    return sgMail.send(message);
  }

  let responseBody = "";
  let statusCode = 0;

  var updateParamsVerified = {
    TableName: "First-Table",
    Key: {
      Email: email,
    },
    UpdateExpression: "set OTP=:r",

    ExpressionAttributeValues: {
      ":r": OTP,
    },
    ReturnValues: "UPDATED_NEW",
  };

  var Scanparams = {
    Key: {
      Email: email,
    },
    TableName: "First-Table",
  };

  var Putparams = {
    Item: {
      Email: email,
      OTP: OTP,
      isVerified: 0,
      tries: 3,
    },
    TableName: "First-Table",
  };

  const data = docClient.get(Scanparams, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.Item) {
        if (data.Item.isVerified) {
          responseBody = `Your Email has already been verified..!`;
          statusCode = 400;
          const response = {
            statusCode: statusCode,
            headers: {
              my_header: "my_value",
            },
            body: JSON.stringify(responseBody),
            isBase64Encoded: false,
          };
          callback(null, responseBody);
        } else {
          if (data.Item.tries > 0) {
            const data = sendMail();
            docClient.update(updateParamsVerified, (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Details updated successfully");
              }
            });
            responseBody = `An OTP has been mailed to you for verification..!`;
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
          } else {
            responseBody = `Number of tries for verification has been exceeded..!`;
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
        }
      } else {
        const data = sendMail();
        docClient.put(Putparams, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Details appended successfully");
          }
        });
        responseBody = `An OTP has been mailed to you for verification..!`;
        statusCode = 201;
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
    }
  });
};
