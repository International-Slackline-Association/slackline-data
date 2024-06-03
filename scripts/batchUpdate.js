const utils = require("./utils");
const nanoId = require("nanoid");
const validateJsonFiles = require("./validation/validateJsonFiles");

const groupsGeojson = utils.files.groupsGeojson;
const groupsJson = utils.files.groupsJson;

const batchRecords = [];

const removeEmptyProperties = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === "" && delete obj[key]);
  return obj;
};

const addUpdateGroup = (g) => {
  const groupIdToCheck =
    g["ID of Group(if empty, a new group will be created)"];

  let existingGroup = undefined;

  if (groupIdToCheck) {
    existingGroup = groupsJson.find(
      (existingGroup) => existingGroup.id === groupIdToCheck
    );

    if (!existingGroup) {
      throw new Error(`Group with ID ${groupIdToCheck} does not exist`);
    }
  }

  const processedGroup = {
    id: existingGroup?.id || nanoId.nanoid(7),
    name: g["Name of Group / Club"] || existingGroup.name,
    createdDateTime:
      existingGroup?.createdDateTime || new Date().toISOString().split("T")[0],
    updatedDateTime: new Date().toISOString().split("T")[0],
    email: g["Email Adress"] || existingGroup?.email,
    facebookPage: g["Facebook Page URL"] || existingGroup?.facebookPage,
    facebookGroup: g["Facebook Groups URL"] || existingGroup?.facebookGroup,
    telegram: g["Telegram URL"] || existingGroup?.telegram,
    instagram: g["Instagram URL"] || existingGroup?.instagram,
    whatsapp: g["Whatsapp URL"] || existingGroup?.whatsapp,
    webpage: g["Website URL"] || existingGroup?.webpage,
  };

  removeEmptyProperties(processedGroup);

  if (existingGroup) {
    groupsJson[groupsJson.indexOf(existingGroup)] = processedGroup;
  } else {
    groupsJson.push(processedGroup);
  }

  const existingGeojsonFeature = groupsGeojson.features.find(
    (f) => f.properties.id === processedGroup.id
  );

  const coordinates =
    g.Coordinates?.split(",")
      .map((coord) => parseFloat(coord))
      .reverse() || [];

  const processedGeojsonFeature = {
    type: "Feature",
    properties: {
      id: processedGroup.id,
      ft: existingGeojsonFeature?.properties.ft || "sg",
      c: existingGeojsonFeature?.properties.c || "XX",
    },
    geometry: {
      type: "Point",
      coordinates:
        coordinates.length === 2
          ? coordinates
          : existingGeojsonFeature.geometry.coordinates,
    },
  };
  if (existingGeojsonFeature) {
    groupsGeojson.features[
      groupsGeojson.features.indexOf(existingGeojsonFeature)
    ] = processedGeojsonFeature;
  } else {
    groupsGeojson.features.push(processedGeojsonFeature);
  }
};

for (const g of batchRecords) {
  console.log("Processing group:", g["Name of Group / Club"]);
  addUpdateGroup(g);
  utils.writeJsonFile("groups/groups.json", groupsJson);
  utils.writeJsonFile("groups/groups.geojson", groupsGeojson);
  validateJsonFiles.run();
}
