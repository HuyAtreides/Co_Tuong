const GridFSBucket = require("mongodb").GridFSBucket;
const path = require("path");
const fs = require("fs");
let bucket;

class USERIMGDAO {
  static injectDB(connection) {
    try {
      bucket = new GridFSBucket(connection.db("co_tuong_user_profile_img"));
    } catch (err) {
      console.log(err.message);
    }
  }

  static uploadFile(filename) {
    return new Promise((resolve, rejects) => {
      try {
        const readableStream = fs.createReadStream(
          `./uploads/profile_pictures/${filename}`
        );
        const uploadStream = bucket.openUploadStream(filename);
        readableStream.pipe(uploadStream);

        uploadStream.on("error", (err) => {
          rejects(err.message);
        });

        uploadStream.on("finish", () => {
          resolve();
        });
      } catch (err) {
        rejects(err.message);
      }
    });
  }

  static downloadFile(filename) {
    return bucket.openDownloadStreamByName(filename);
  }
}

module.exports = USERIMGDAO;
