const path = require('path');
const fs = require('fs');
const activities = require('./activities');
const distance = require('./distance');
const util = require('./util');

const writeFilePromise = util.writeFilePromise;

const saveActivities = activities.saveActivities;
const getActivities = activities.getActivities;
const readActivities = activities.readActivities;

// Only needs to be set if --generate-file is specified
const ACTIVITIES_DIR = path.join(__dirname, '..', '..', '..', '..', 'Strava Activities 1-13-16');

const TRIMMED_FILE = path.join(__dirname, 'trimmed.json');

if (process.argv.indexOf('--generate-file') !== -1) {
  getActivities(ACTIVITIES_DIR)
    .then((contents) => {
      return saveActivities(contents);
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  readActivities()
    .then((activities) => {
      const trimmed = [];
      activities.forEach((activity) => {
        const pointsArr = activity.gpx.trk[0].trkseg[0].trkpt.map((pt) => {
          return [pt.$.lat, pt.$.lon].map(Number);
        });
        trimmed.push({
          time: activity.gpx.metadata[0].time[0],
          distance: distance(pointsArr),
        });
      });
      return Promise.resolve(trimmed);
    })
    .then((trimmed) => {
      console.log('Writing trimmed file...');
      return writeFilePromise(TRIMMED_FILE, JSON.stringify(trimmed, null, 2));
    })
    .then(() => {
      console.log('Trimmed file written.');
    })
    .catch((err) => {
      console.log(err);
    });
}
