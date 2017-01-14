const fs = require('fs');

function readFilePromise(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function writeFilePromise(file, contents) {
  return new Promise((resolve, reject) => {
    console.log('Writing file...');
    fs.writeFile(file, contents, 'utf8', (err) => {
      if (err) {
        reject(err);
      }
      resolve(contents);
    });
  });
}

module.exports = {
  readFilePromise,
  writeFilePromise,
};
