const AWS = require('aws-sdk')
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'ap-south-1' })

let expMin = process.env.OTP_EXPIRY_MINS

const generateRandomNo = (n) => {
  return crypto.randomInt(Math.pow(10,n-1),Math.pow(10,n));
}

const generateExpiryEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000) + expMin * 60
}

const sendEmail = async (otp,email) => {
  try {
    const msg = {
      to: `${email}`,
      from: 'noreply@reservemyslot.com',
      subject: 'Email Verification',
      text: `Kindly verify your Email. Your OTP is ${otp}`,
      html: `Kindly verify your Email. <br> Your OTP is <strong> ${otp}</strong>`,
    }

    await sgMail.send(msg)
    console.log('Email sent')
  } catch (error) {
    console.error(error)
    return error
  }
}

exports.handler = async (event) => {
  try {
    let body = JSON.parse(JSON.stringify(event.body))

    if (!body.email) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Credentials': true,
        },
        body: {
          message: 'Required field email not found',
        },
      }
    }

    let email = body.email
    email = email.toLowerCase();

    let getParams = {
      TableName: process.env.DB_TABLE_NAME,
      Key: {
        email: email,
      },
    }

    let data = await docClient.get(getParams).promise()

    let item = data.Item

    if (item && item.verified ) {
       return {
         statusCode: 403,
         headers: {
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Credentials': true,
         },
         body: {
           message: 'Email is already verified',
         },
       }
    }

    if (item && item.tries >= process.env.LIMIT) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Credentials': true,
        },
        body: {
          message: 'Verification Tries Limit exceeded',
        },
      }
    }

    let otp = generateRandomNo(6)

    let expireTime = generateExpiryEpochTime()

    if (item && item.tries < process.env.LIMIT) {
      let updateParams = {
        TableName: 'OTP-system',
        Key: {
          email: email,
        },
        UpdateExpression: 'set tries = tries + :val,otp = :o,expireAt = :e',
        ExpressionAttributeValues: {
          ':val': 1,
          ':o': otp,
          ':e': expireTime,
        },
        ReturnValues: 'UPDATED_NEW',
      }

      let result = await docClient.update(updateParams).promise()
      await sendEmail(otp,email)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Credentials': true, 
        },
        body: {
          message: 'New OTP generated successfully!',
          data: email,
        },
      }
    }

    let params = {
      TableName: process.env.DB_TABLE_NAME,
      Item: {
        email: email,
        otp: otp,
        expireAt: expireTime,
        tries: 0,
        verified: false,
      },
    }

    let result = await docClient.put(params).promise()
    await sendEmail(otp,email)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true, 
      },
      body: {
        message: 'OTP generated successfully!',
        data: email,
      },
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
