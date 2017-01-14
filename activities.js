const path = require('path');
const fs = require('fs');
const parseXml = require('xml2js').parseString;

const DATA_FILE = path.join(__dirname, 'data.json');

function listDirectoryPromise(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files);
    });
  });
}

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

function parseXmlPromise(string) {
  return new Promise((resolve, reject) => {
    parseXml(string, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    })
  });
}

function saveFilePromise(file, contents) {
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

function getActivitiesJSON(activitiesDir) {
  console.log('Listing activities directory...');
  return listDirectoryPromise(activitiesDir)
    .then((files) => {
      console.log('Directory listing done, reading files...');
      const filePromises = [];
      files.forEach((fileName) => {
        const fullpath = path.join(activitiesDir, fileName);
        filePromises.push(readFilePromise(fullpath));
      });
      return Promise.all(filePromises)
    })
    .then((fileContents) => {
      console.log('Files read, converting to JSON...');
      const jsonPromises = [];
      fileContents.forEach((fileContent) => {
        jsonPromises.push(parseXmlPromise(fileContent));
      });
      return Promise.all(jsonPromises);
    })
    .then((jsonContents) => {
      console.log('Files converted to JSON.')
      return Promise.resolve(jsonContents);
    });
}

function saveActivitiesFile(contentsArray) {
  return saveFilePromise(DATA_FILE, JSON.stringify(contentsArray))
    .then(() => {
      console.log('Activities successfully saved.');
      return Promise.resolve();
    });
}

function readActivitiesFile() {
  return new Promise((resolve, reject) => {
    return fs.readFile(DATA_FILE, 'utf-8', (err, contents) => {
      if (err) {
        return reject(err);
      }
      resolve(contents);
    });
  });
}

module.exports = {
  saveActivities: saveActivitiesFile,
  getActivities: getActivitiesJSON,
  readActivities: readActivitiesFile,
};
