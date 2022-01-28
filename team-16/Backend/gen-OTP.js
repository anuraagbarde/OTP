"use strict";

console.log("Loading function");
const API_KEY =
  "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";
const AWS = require("aws-sdk");
const sgMail = require("@sendgrid/mail");
const otpGenerator = require("otp-generator");

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });

exports.handler = function (event, context, callback) {
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  sgMail.setApiKey(API_KEY);
  let body = event;

  let { email } = body;
  const message = {
    to: email,
    from: {
      name: "noobMaster69",
      email: "djokernovak7@gmail.com",
    },
    subject: "OTP Request",
    text: `Your One Time Password (OTP) for Email verification is: ${OTP}`,
    html: `<p>Your One Time Password (OTP) for Email verification is: <span styles="text-style: bold"></span>${OTP}</span></p>`,
  };

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

  const data = docClient.get(Scanparams, (err, data) => {
    if (err) {
      return;
    } else {
      try {
        if (data.Item.Email) {
          if (data.Item.isVerified) {
            callback(null, "Verified Succesfully");
          } else {
            if (data.Item.tries > 0) {
              const data = sgMail.send(message);
              docClient.update(updateParamsVerified, function (err, data) {
                if (err) {
                  console.error(
                    "Unable to update item. Error JSON:",
                    JSON.stringify(err, null, 2)
                  );
                } else {
                  console.log(
                    "UpdateItem succeeded:",
                    JSON.stringify(data, null, 2)
                  );
                }
              });
              callback(null, "Mail sent");
            } else {
              callback("Number of tries exceeded..!");
            }
          }
        }
      } catch (err) {
        var Putparams = {
          Item: {
            Email: email,
            OTP: OTP,
            isVerified: 0,
            tries: 3,
          },
          TableName: "First-Table",
        };
        const data = sgMail.send(message);
        docClient.put(Putparams, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            callback(null, "Mail Sent");
          }
        });
      }
    }
  });
};
