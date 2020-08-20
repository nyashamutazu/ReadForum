const AWS_CONFIG = require("../config/aws.conig");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: AWS_CONFIG.AWS.ACCESS_KEY_ID,
  secretAccessKey: AWS_CONFIG.AWS.SECRET_ACCESS_KEY
});

module.exports = s3;