const path = require('path');
const fs = require('fs');
const parseXml = require('xml2js').parseString;

const util = require('./util');
const readFilePromise = util.readFilePromise;
const writeFilePromise = util.writeFilePromise;

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
  return writeFilePromise(DATA_FILE, JSON.stringify(contentsArray))
    .then(() => {
      console.log('Activities successfully saved.');
      return Promise.resolve();
    });
}

function readActivitiesFile() {
  return readFilePromise(DATA_FILE)
    .then((contents) => {
      return Promise.resolve(JSON.parse(contents));
    });
}

module.exports = {
  saveActivities: saveActivitiesFile,
  getActivities: getActivitiesJSON,
  readActivities: readActivitiesFile,
};
