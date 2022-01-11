const AWS = require('aws-sdk')
const crypto = require('crypto')

const docClient = new AWS.DynamoDB.DocumentClient({ region: 'ap-south-1' })

let expMin = process.env.OTP_EXPIRY_MINS

const generateRandomNo = (n) => {
  return Math.floor(Math.pow(10, n - 1) * (1 + Math.random() * 9))
}

const generateExpiryEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000) + expMin * 60
}

exports.handler = async (event, context) => {
  try {
    let body = JSON.parse(JSON.stringify(event.body))

    if (!body.email) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Required field email not found',
        }),
      }
    }

    let email = body.email

    let getParams = {
      TableName: process.env.DB_TABLE_NAME,
      Key: {
        email: email,
      },
    }

    let data = await docClient.get(getParams).promise()

    let item = data.Item

    if (item && item.tries >= process.env.LIMIT) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: 'Verification Tries Limit exceeded',
        }),
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

      return {
        statusCode: 200,
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

    return {
      statusCode: 200,
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
