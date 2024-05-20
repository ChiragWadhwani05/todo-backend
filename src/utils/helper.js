import fs from "fs";

/**
 * @description returns the file's local path in the file system
 *
 * @param {string} fileName
 */
function getLocalPath(fileName) {
  return `public/images/${fileName}`;
}

/**
 * @description Remove the file from local path
 *
 * @param {string} localPath
 */
function removeLocalFile(localPath, isLocalPath = true) {
  if (typeof localPath === "string") {
    if (isLocalPath) {
      localPath = getLocalPath(localPath);
    }

    fs.unlinkSync(localPath, (err) => {
      if (err) console.log("Error while removing local files: ", err);
    });
  }
}

export { getLocalPath, removeLocalFile };
