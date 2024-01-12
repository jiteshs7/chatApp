const fs = require("fs");
const path = require("path");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      // throw new Error(err);
      console.log("feed.js clearImage() Error=", err);
    }
  });
};

module.exports = clearImage;
