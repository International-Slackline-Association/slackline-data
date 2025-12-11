const utils = require("./utils");
const nanoId = require("nanoid");
const validateJsonFiles = require("./validation/validateJsonFiles");

// Parse JSON argument
if (!process.argv[2]) {
  console.error("Usage: node batchUpdate.js '<JSON_OBJECT>'");
  process.exit(1);
}

let groupData;
try {
  groupData = JSON.parse(process.argv[2]);
} catch (error) {
  console.error("Error parsing JSON argument:", error.message);
  process.exit(1);
}

const groupsGeojson = utils.files.groupsGeojson;
const groupsJson = utils.files.groupsJson;

const removeEmptyProperties = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === "" && delete obj[key]);
  return obj;
};

// Find existing group if ID provided
const groupId = groupData["ID of Group(if empty, a new group will be created)"];
let existingGroup = undefined;

if (groupId) {
  existingGroup = groupsJson.find((group) => group.id === groupId);
  if (!existingGroup) {
    throw new Error(`Group with ID ${groupId} does not exist`);
  }
}

// Build group object
const processedGroup = {
  id: existingGroup?.id || nanoId.nanoid(7),
  name: groupData["Name of Group / Club"] || existingGroup?.name,
  createdDateTime:
    existingGroup?.createdDateTime || new Date().toISOString().split("T")[0],
  updatedDateTime: new Date().toISOString().split("T")[0],
  email: groupData["Email Adress"] || existingGroup?.email,
  facebookPage: groupData["Facebook Page URL"] || existingGroup?.facebookPage,
  facebookGroup:
    groupData["Facebook Groups URL"] || existingGroup?.facebookGroup,
  telegram: groupData["Telegram URL"] || existingGroup?.telegram,
  instagram: groupData["Instagram URL"] || existingGroup?.instagram,
  whatsapp: groupData["Whatsapp URL"] || existingGroup?.whatsapp,
  webpage: groupData["Website URL"] || existingGroup?.webpage,
};

removeEmptyProperties(processedGroup);

// Update or add to groups.json
if (existingGroup) {
  groupsJson[groupsJson.indexOf(existingGroup)] = processedGroup;
} else {
  groupsJson.push(processedGroup);
}

// Handle geojson
const existingGeojsonFeature = groupsGeojson.features.find(
  (f) => f.properties.id === processedGroup.id
);

const coordinates =
  groupData.Coordinates?.split(",")
    .map((coord) => parseFloat(coord.trim()))
    .reverse() || [];

const processedGeojsonFeature = {
  type: "Feature",
  properties: {
    id: processedGroup.id,
    ft: existingGeojsonFeature?.properties.ft || "sg",
    c:
      groupData["Country Code"] || existingGeojsonFeature?.properties.c || "XX",
  },
  geometry: {
    type: "Point",
    coordinates:
      coordinates.length === 2
        ? coordinates
        : existingGeojsonFeature?.geometry.coordinates,
  },
};

if (existingGeojsonFeature) {
  groupsGeojson.features[
    groupsGeojson.features.indexOf(existingGeojsonFeature)
  ] = processedGeojsonFeature;
} else {
  groupsGeojson.features.push(processedGeojsonFeature);
}

// Write files and validate
console.log("Processing group:", processedGroup.name);
utils.writeJsonFile("groups/groups.json", groupsJson);
utils.writeJsonFile("groups/groups.geojson", groupsGeojson);
validateJsonFiles.run();
console.log("✓ Successfully processed:", processedGroup.name);
