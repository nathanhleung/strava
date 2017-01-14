const util = require('./util');
const path = require('path');

const readFilePromise = util.readFilePromise;

function miles(runArr) {
  return runArr.reduce((accumulator, run) => {
    return accumulator + run.distance;
  }, 0);
}

readFilePromise(path.join(__dirname, 'trimmed.json'))
  .then((contents) => {
    const json = JSON.parse(contents);
    // All Sunday runs since summer running started
    const sundays2016 = json.filter((run) => {
      const date = new Date(run.time);
      // Sunday, 2016, and in June (months are 0-indexed)
      if (date.getDay() === 0 && date.getFullYear() >= 2016 && date.getMonth() >= 5) {
        return true;
      }
      return false;
    });
    const runs2016 = json.filter((run) => {
      if ((new Date(run.time)).getFullYear() === 2016) {
        return true;
      }
      return false;
    });
    const sundayMiles = miles(sundays2016);
    const miles2016 = miles(runs2016);
    const timeSinceJune = (new Date()).getTime() - (new Date('June 20, 2016')).getTime();
    const weeksSinceJune = timeSinceJune / (1000 * 60 * 60 * 24 * 7);
    console.log('Sunday miles in 2016:', sundayMiles);
    console.log('Weeks since June:', weeksSinceJune);
    console.log('Number of sunday runs:', sundays2016.length);
    console.log('2016 miles:', miles2016);
    console.log('2016 runs:', runs2016.length);
  })
  .catch((err) => {
    console.log(err);
  });
