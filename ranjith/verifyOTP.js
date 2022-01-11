const AWS = require('aws-sdk')
var docClient = new AWS.DynamoDB.DocumentClient()

let response

module.exports.handler = async (event) => {
  let body = JSON.parse(JSON.stringify(event.body))

  if (!body.email || !body.otp) {
    return (response = {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Required fields email or otp  not found',
      }),
    })
  }

  try {
    let email = body.email
    let otp = body.otp
    otp = parseInt(otp)
    let expiry = Math.floor(new Date().getTime() / 1000)

    let params = {
      TableName: process.env.TableName,
      Key: {
        email: email,
      },
    }

    let item = await docClient.get(params).promise()
    item = item.Item

    if (item.verified) {
      return (response = {
        statusCode: 403,
        body: JSON.stringify({
          message: 'you are already verified',
        }),
      })
    }

    if (item.expireAt < expiry) {
      return (response = {
        statusCode: 403,
        body: JSON.stringify({
          message: 'otp expired ',
        }),
      })
    }

    if (item.otp != otp) {
      return (response = {
        statusCode: 403,
        body: JSON.stringify({
          message: 'otp is wrong',
        }),
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
      body: JSON.stringify({
        message: `${email} Validated`,
      }),
    })
  } catch (error) {
    console.log(error)
    return error
  }
}
