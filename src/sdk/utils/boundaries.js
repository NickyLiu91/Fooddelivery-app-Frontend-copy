const METERS_IN_MILE = 1609.344;

export const getCircleBounds = (center, miles) => {
  const points = 12;
  const radius = miles * METERS_IN_MILE;
  const { spherical } = window.google.maps.geometry;
  const location = new window.google.maps.LatLng(center.lat, center.lng);
  const bounds = [];
  const p = 360 / points;
  let d = 0;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < points; ++i, d += p) {
    bounds.push(spherical.computeOffset(location, radius, d));
  }
  return bounds;
};

export const getSquareBounds = (center, miles) => {
  const location = new window.google.maps.LatLng(center.lat, center.lng);
  const { spherical } = window.google.maps.geometry;
  const meters = miles * METERS_IN_MILE;
  const ne = spherical.computeOffset(location, meters, 45);
  const nw = spherical.computeOffset(location, meters, -45);
  const se = spherical.computeOffset(location, meters, 135);
  const sw = spherical.computeOffset(location, meters, -135);
  return [ne, se, sw, nw];
};
