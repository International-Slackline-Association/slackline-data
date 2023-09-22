const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const utils = require("../utils");
const stringSimilarity = require("string-similarity-js").stringSimilarity;

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

const groupsGeojson = utils.files.groupsGeojson;
const groupsJson = utils.files.groupsJson;

const geojsonIds = groupsGeojson.features.map(
  (feature) => feature.properties.id
);
const groupsIds = groupsJson.map((group) => group.id);

const validateJsonSchemas = () => {
  const validate = (json, schema, name) => {
    const validate = ajv.compile(schema);
    const isValid = validate(json);
    if (!isValid) {
      console.error(`Invalid JSON format for ${name}`);
      console.error(validate.errors);
      process.exit(1);
    }
  };
  validate(groupsJson, utils.files.groupsSchema, "groups.json");
  validate(groupsGeojson, utils.files.groupsGeojsonSchema, "groups.geojson");
  validate(
    utils.files.isaMembersJson,
    utils.files.isaMembersSchema,
    "isaMembers.json"
  );
};

const validateGroupsMatchingIds = () => {
  const validateMissingIds = (ids1, ids2, fileName) => {
    let missingIds = ids1.filter((id) => !ids2.includes(id));
    if (missingIds.length > 0) {
      console.error(
        `The following group ids are missing in ${fileName}: ${missingIds.join(
          ", "
        )}`
      );
      process.exit(1);
    }
  };
  validateMissingIds(groupsIds, geojsonIds, "groups.geojson");
  validateMissingIds(geojsonIds, groupsIds, "groups.json");
  validateMissingIds(
    utils.files.isaMembersJson.map((m) => m.groupId).filter((id) => id),
    groupsIds,
    "groups.json"
  );
};

const validateUniqueIds = () => {
  const checkDuplicates = (array) => {
    const duplicates = array.filter(
      (item, index) => array.indexOf(item) != index
    );
    if (duplicates.length > 0) {
      console.error(
        `The following ids are duplicated: ${duplicates.join(", ")}`
      );
      process.exit(1);
    }
  };
  checkDuplicates(groupsIds);
  checkDuplicates(geojsonIds);
};

const validateCoordinatesProximity = () => {
  const duplicates = [];

  for (let i = 0; i < groupsGeojson.features.length; i++) {
    const feature1 = groupsGeojson.features[i];
    const coord1 = feature1.geometry.coordinates;
    const matches = [feature1];

    for (let j = i + 1; j < groupsGeojson.features.length; j++) {
      const feature2 = groupsGeojson.features[j];
      const coord2 = feature2.geometry.coordinates;

      if (
        Math.abs(coord1[0] - coord2[0]) <= 0.005 &&
        Math.abs(coord1[1] - coord2[1]) <= 0.005
      ) {
        matches.push(feature2);
      }
    }

    if (matches.length > 1) {
      duplicates.push(matches);
    }
  }
  if (duplicates.length > 0) {
    console.error(
      `The following groups have coordinates close to each other: ${duplicates
        .map((d) => d.map((f) => f.properties.id).join(", "))
        .join("; ")}`
    );
    process.exit(1);
  }
};

const validateSimilarGroupNames = () => {
  const names = groupsJson.map((g) => g.name);
  const duplicates = [];
  for (let i = 0; i < names.length; i++) {
    const name1 = names[i];
    const matches = [name1];

    for (let j = i + 1; j < names.length; j++) {
      const name2 = names[j];
      const similarity = stringSimilarity(name1, name2);

      if (similarity >= 0.95) {
        matches.push(name2);
      }
    }

    if (matches.length > 1) {
      duplicates.push(matches);
    }
  }

  if (duplicates.length > 0) {
    console.error(
      `The following groups have very similar names: ${duplicates
        .map((d) => d.join(", "))
        .join("; ")}`
    );
    process.exit(1);
  }
  return duplicates;
};

validateJsonSchemas();
validateGroupsMatchingIds();
validateUniqueIds();
validateCoordinatesProximity();
validateSimilarGroupNames();
