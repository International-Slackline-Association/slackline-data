# Slackline Groups

This is a list of Slackline groups around the world. They are displayed on the [SlackMap](https://slackmap.com/communities).
If you think the data is incorrect or missing please follow either of the following options:

## How to add/modify data using Google Forms

You can fill out **[THIS FORM](https://forms.gle/ZpurHxHhUfj2yppg7)** to let us know what to update. The process of adding / editing through this form is done in manual work, so it can take time: usually a couple weeks. If you would like to make this happen faster, you need to edit the data yourself as described below

## How to add/modify data on Github

There are 2 files:

- `groups.json` - contains the detail data for each group in [JSON format](https://en.wikipedia.org/wiki/JSON)
- `groups.geojson` - contains the data only relevant for the map in [GeoJSON format](https://en.wikipedia.org/wiki/GeoJSON). The data has to be as small as possible to keep the map fast.

Update the each file depending on your need **without** changing the structure of the file and create pull request. To validate the changes you can use these two websites:

- [JSONLint](https://jsonlint.com/) to validate the `groups.json` file
- [GeoJSON.io](http://geojson.io/) to validate the `groups.geojson` file

Validate here means, you copy the entire content of the files, including your changes into these websites and click "validate" to see if you made the entries correct.

**Warning**: If you add new data you **HAVE** to add the data to both files with unique `id` values. You can generate unique id's from scratch, for example with [Nanoid Generator](https://nanoid.jormaechea.com.ar/?length=7&quantity=1) (length is 7 characters). If you copy paste the `id` from another entry in the list it WILL NOT WORK. Also, the `coordinates` field in geojson files are in the order of [longitude, latitude] (which is oposite from a normal google entry, just switch it around). So first value is longitude and second value is latitude - this is a common mistake when entering. Keep the `ft: sg` field in the geojson file.

If this also does not work, contact us here:
**Email**: slackmap@slacklineinternational.org

## JSON Format for `groups.json`

```ts
interface Group {
    id: string,
    name: string,
    createdDateTime: string, // only date
    updatedDateTime: string, // only date
    email?: string, // optional
    facebookPage?: string, // optional
    facebookGroup?: string, // optional
    telegram?: string, // optional
    instagram?: string, // optional
    whatsapp?: string, // optional
    webpage?: string, // optional
}
```

## JSON Format for `groups.gojson`

```ts
interface Feature {
    type: "Feature", // fixed value 
    properties: {
        id: string, // matching id in groups.json
        ft: "sg", // fixed value for slackmap map view
        c: string, // country code in ISO 3166-1 alpha-2 format
    },
    geometry: {
        type: "Point", // fixed value
        coordinates: [number, number], // [longitude, latitude]
    }
}
```
