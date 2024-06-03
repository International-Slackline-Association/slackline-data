const utils = require("./utils");
const nanoId = require("nanoid");
const validateJsonFiles = require("./validation/validateJsonFiles");

const groupsGeojson = utils.files.groupsGeojson;
const groupsJson = utils.files.groupsJson;

const batchRecords = [];

const parseRecords = () => {
  const newGroups = [];
  const updatedGroups = [];

  for (const record of batchRecords) {
    if (record["What do you want to do?"] === "Add new data") {
      newGroups.push(record);
    } else if (record["What do you want to do?"] === "Edit existing data") {
      updatedGroups.push(record);
    }
  }
  return { newGroups, updatedGroups };
};

const removeEmptyProperties = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === "" && delete obj[key]);
  return obj;
};

const addUpdateGroup = (g) => {
  const existingGroup = groupsJson.find(
    (existingGroup) => existingGroup.name === g["Name of Group / Club"].trim()
  );

  if (g["What do you want to do?"] === "Edit existing data" && !existingGroup) {
    throw new Error(
      `Group with name ${g["Name of Group / Club"]} does not exist`
    );
  }

  const processedGroup = {
    id: existingGroup?.id || nanoId.nanoid(7),
    name: g["Name of Group / Club"] || existingGroup.name,
    createdDateTime:
      existingGroup?.createdDateTime || new Date().toISOString().split("T")[0],
    updatedDateTime: new Date().toISOString().split("T")[0],
    email: g["Email Adress"] || existingGroup?.email,
    facebookPage: g["Link to Facebook"] || existingGroup?.facebookPage,
    facebookGroup: existingGroup?.facebookGroup,
    telegram: existingGroup?.telegram,
    instagram: g["Link to Instagram"] || existingGroup?.instagram,
    whatsapp:
      g["Link to Messenger App (Whatsapp/Telegram/Signal/other)"] ||
      existingGroup?.whatsapp,
    webpage: g["Link to Website"] || existingGroup?.webpage,
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

const { newGroups, updatedGroups } = parseRecords();
for (const g of [...updatedGroups, ...newGroups]) {
  console.log("Processing group:", g["Name of Group / Club"]);
  addUpdateGroup(g);
  utils.writeJsonFile("groups/groups.json", groupsJson);
  utils.writeJsonFile("groups/groups.geojson", groupsGeojson);
  validateJsonFiles.run();
}
