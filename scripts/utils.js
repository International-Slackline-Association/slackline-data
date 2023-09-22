const fs = require("fs");
const path = require("path");

const readJsonFile = (file) => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file), "utf8"));
};

const writeJsonFile = (file, json) => {
  fs.writeFileSync(
    path.join(__dirname, "../data/communities/", file),
    JSON.stringify(json)
  );
};

const groupsGeojson = readJsonFile("../data/communities/groups/groups.geojson");
const groupsGeojsonSchema = require("./validation/jsonSchemas/groupsGeojson.schema.json");

const groupsJson = require("../data/communities/groups/groups.json");
const groupsSchema = require("./validation/jsonSchemas/groups.schema.json");

const isaMembersJson = require("../data/communities/isa/members.json");
const isaMembersSchema = require("./validation/jsonSchemas/isaMembers.schema.json");

const files = {
  groupsGeojson,
  groupsJson,
  isaMembersJson,
  groupsGeojsonSchema,
  groupsSchema,
  isaMembersSchema,
};

module.exports = {
  readJsonFile,
  files,
  writeJsonFile,
};
