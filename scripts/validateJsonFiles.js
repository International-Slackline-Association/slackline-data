const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

const jsonFilesToValidate = {
  "../communities/groups/groups.json": {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
          minLength: 7,
          maxLength: 7,
        },
        name: {
          type: "string",
        },
        lat: {
          type: "number",
          minimum: -90,
          maximum: 90,
        },
        lng: {
          type: "number",
          minimum: -180,
          maximum: 180,
        },
        createdDateTime: {
          type: "string",
          format: "date",
        },
        updatedDateTime: {
          type: "string",
          format: "date",
        },
        email: {
          type: "string",
          format: "email",
        },
        facebook: {
          type: "string",
        },
        telegram: {
          type: "string",
        },
        instagram: {
          type: "string",
        },
        whatsapp: {
          type: "string",
        },
        webpage: {
          type: "string",
          format: "uri",
        },
      },
      required: [
        "id",
        "name",
        "lat",
        "lng",
        "createdDateTime",
        "updatedDateTime",
      ],
      additionalProperties: false,
    },
  },
  "../communities/groups/groups.geojson": {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    required: ["type", "features"],
    properties: {
      type: {
        type: "string",
        enum: ["FeatureCollection"],
      },
      features: {
        type: "array",
        items: {
          type: "object",
          required: ["type", "properties", "geometry"],
          properties: {
            type: {
              type: "string",
              enum: ["Feature"],
            },
            properties: {
              type: "object",
              required: ["id", "ft"],
              properties: {
                id: {
                  type: "string",
                  minLength: 7,
                  maxLength: 7,
                },
                ft: {
                  type: "string",
                  enum: ["sg"],
                },
              },
            },
            geometry: {
              type: "object",
              required: ["type", "coordinates"],
              properties: {
                type: {
                  type: "string",
                  enum: ["Point", "MultiPoint"],
                },
                coordinates: {
                  type: "array",
                  items: {
                    oneOf: [
                      {
                        type: "number",
                        minimum: -180,
                        maximum: 180,
                      },
                      {
                        type: "array",
                        items: {
                          type: "number",
                          minimum: -180,
                          maximum: 180,
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "../communities/organizations/organizations.json": {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
          minLength: 12,
          maxLength: 12,
        },
        name: {
          type: "string",
        },
        email: {
          type: "string",
          format: "email",
        },
      },
      required: ["id", "name", "email"],
      additionalProperties: false,
    },
  },
  "../communities/organizations/managedAreas.geojson": {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    required: ["type", "features"],
    properties: {
      type: {
        type: "string",
        enum: ["FeatureCollection"],
      },
      features: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["Feature"],
            },
            geometry: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["Polygon", "MultiPolygon"],
                },
                coordinates: {
                  type: "array",
                  items: {
                    type: ["number", "array", "object"],
                  },
                },
              },
              required: ["type", "coordinates"],
            },
            properties: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  minLength: 2,
                  maxLength: 2,
                },
                cn: {
                  type: "string",
                },
                ft: {
                  type: "string",
                  enum: ["ma"],
                },
                organizationIds: {
                  type: "array",
                  items: {
                    type: "string",
                    minLength: 12,
                    maxLength: 12,
                  },
                },
              },
              required: ["id", "cn", "ft", "organizationIds"],
            },
          },
          required: ["type", "geometry"],
        },
      },
    },
  },
};

for (const [file, schema] of Object.entries(jsonFilesToValidate)) {
  const fileContent = fs.readFileSync(path.join(__dirname, file), "utf8");
  const json = JSON.parse(fileContent);
  const validate = ajv.compile(schema);
  const isValid = validate(json);
  if (!isValid) {
    console.error(`Invalid JSON format for ${file}`);
    console.error(validate.errors);
    process.exit(1);
  }
}
