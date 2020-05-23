'use strict';

const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const type = require('file-type')
const { parse } = require('aws-multipart-parser')



function success(body) {
  return buildResponse(200, body);
}
function failure(body) {
  return buildResponse(500, body);
}
function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

module.exports.upload = async (event, context, callback) => {
  // console.log("Received event:", JSON.stringify(event.body.data, null, 2));
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.body !== null && event.body !== undefined) {
    

    const formData = await parse(event, true);
    console.log(formData)
    let { content, filename, contentType } = formData.file
    // const fileType = await type.fromBuffer(content);  
    // console.log(fileType);  
    
        const params = {
        Bucket: process.env.BUCKET,
        Key: filename,
        Body: content,
        ContentType: contentType,
        ACL: 'public-read',
        };
      
      try {
        await s3.putObject(params).promise();
        // console.log(`https://${process.env.BUCKET}.s3.amazonaws.com/${fileName}`)
        callback(
          null,
          success({
            link: `https://${process.env.BUCKET}.s3.amazonaws.com/${filename}`
          })
        );
      } catch (e) {
        console.log(e);
        //callback(e);
        // failure(e)
      }
  }
};
