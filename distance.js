function toRadians(degrees) {
  return degrees / (180 / Math.PI);
}

// Haversine
function hav(radians) {
  return (1 - Math.cos(radians)) / 2;
}

function distance(point1, point2) {
  // Miles
  const R = 3959;
  const p1 = point1.map(toRadians);
  const p2 = point2.map(toRadians);
  console.log(p1);
  const radicand =
    hav(p2[0] - p1[0]) + Math.cos(p1[0]) * Math.cos(p2[0]) * hav(p2[1] - p1[1]);
  return 2 * R * Math.asin(Math.sqrt(radicand));
}

module.exports = distance;
