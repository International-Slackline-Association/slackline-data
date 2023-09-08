const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

const readJsonFile = (file) => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file), "utf8"));
};

const groupsJson = readJsonFile("../communities/groups/groups.json");
const groupsSchema = readJsonFile("./jsonSchemas/groups.schema.json");

const groupsGeojson = readJsonFile("../communities/groups/groups.geojson");
const groupsGeojsonSchema = readJsonFile(
  "./jsonSchemas/groupsGeojson.schema.json"
);

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
  validate(groupsJson, groupsSchema, "groups.json");
  validate(groupsGeojson, groupsGeojsonSchema, "groups.geojson");
};

const validateGroupsMatchingIds = () => {
  const geojsonIds = groupsGeojson.features.map((feature) => feature.properties.id);
  const groupsIds = groupsJson.map((group) => group.id);
  const missingIds = geojsonIds.filter((id) => !groupsIds.includes(id));
  if (missingIds.length > 0) {
    console.error(
      `The following group ids are missing in groups.json: ${missingIds.join(
        ", "
      )}`
    );
    process.exit(1);
  }
};

validateJsonSchemas();
validateGroupsMatchingIds();
