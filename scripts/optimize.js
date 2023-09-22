const truncate = require("@turf/truncate").default;
const utils = require("./utils");

const optimizeGeoJson = () => {
  truncate(utils.files.groupsGeojson, { precision: 3, mutate: true });
  utils.writeJsonFile("groups/groups.geojson", utils.files.groupsGeojson);
};

optimizeGeoJson();
