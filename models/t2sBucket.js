require("dotenv").config();
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  projectId: "pizza100-358205",
  keyFilename: "./pizza100-358205-633824a250a6.json",
});

const bucketName = "code-star";
const bucket = storage.bucket(bucketName);

module.exports = bucket;
