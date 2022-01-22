const AWS = require('aws-sdk')
var docClient = new AWS.DynamoDB.DocumentClient()

let response

module.exports.handler = async (event) => {
  try {
    let body = JSON.parse(JSON.stringify(event.body))

    if (!body.email) {
      return (response = {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: {
          message: 'Required field Email  not found',
        },
      })
    }

    let email = body.email
    email = email.toLowerCase()

    if (!body.email) {
      return (response = {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: {
          message: 'Required field Email not found',
        },
      })
    }

    let params = {
      TableName: process.env.TableName,
      Key: {
        email: email,
      },
    }

    let item = await docClient.get(params).promise()
    item = item.Item
    console.log(item)
    if (item.verified) {
      return (response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: {
          verified: true,
          message: 'your verification status is true',
        },
      })
    }

    if (!body.otp) {
      return (response = {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: {
          message: 'Required field OTP not found',
        },
      })
    }

    let otp = body.otp
    otp = parseInt(otp)
    let expiry = Math.floor(new Date().getTime() / 1000)

    if (item.otp != otp) {
      return (response = {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: {
          message: 'otp is wrong',
        },
      })
    }

    if (item.expireAt < expiry) {
      return (response = {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: {
          message: 'otp expired ',
        },
      })
    }

    let updateParams = {
      TableName: process.env.TableName,
      Key: {
        email: email,
      },
      UpdateExpression: 'set verified = :v',
      ExpressionAttributeValues: {
        ':v': true,
      },
      ReturnValues: 'UPDATED_NEW',
    }

    let data = await docClient.update(updateParams).promise()

    return (response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: {
        message: `${email} Validated`,
      },
    })
  } catch (error) {
    console.log(error)
    return error
  }
}
