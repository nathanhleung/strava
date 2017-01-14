const path = require('path');
const activities = require('./activities');
const distance = require('./distance');

const saveActivities = activities.saveActivities;
const getActivities = activities.getActivities;
const readActivities = activities.readActivities;

const activitiesDir = path.join(__dirname, '..', '..', 'Strava Activities 1-13-16');

if (process.argv.indexOf('--generate-file') !== -1) {
  getActivities(activitiesDir)
    .then((contents) => {
      return saveActivities(contents);
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  readActivities()
    .then((contents) => {
      console.log(contents);
    })
    .catch((err) => {
      console.log(err);
    });
}




/*
const trimmed = [];
jsonContents.forEach((json) => {
  trimmed.push({
    time: json.metadata.time,

  });
});
*/
