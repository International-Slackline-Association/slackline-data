const fs = require("fs");
const path = require("path");
const truncate = require("@turf/truncate").default;

const readJsonFile = (file) => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file), "utf8"));
};

const groupsGeojson = readJsonFile("../data/communities/groups/groups.geojson");

const optimizeGeoJson = () => {
  truncate(groupsGeojson, { precision: 3, mutate: true });
  fs.writeFileSync(
    path.join(__dirname, "../data/communities/groups/groups.geojson"),
    JSON.stringify(groupsGeojson)
  );
};

optimizeGeoJson();
