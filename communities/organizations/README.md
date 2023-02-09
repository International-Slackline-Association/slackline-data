# ISA Organizations

This is a list of Slackline Organizations(that are ISA Members) for each country around the world. They are displayed on the [SlackMap](https://slackmap.com/communities). This data, is used to hand out editorship rights for lines & spots in SlackMap. All the members of the organization become editors for the lines & spots in their country.

If you think the data is incorrect or missing please contact ISA.
**Email**: slackmap@slacklineinternational.org

## How to add/modify data

**⚠️ ONLY ISA APPROVED organizations are allowed to edit this. Please do not add yourself or your organization without approval first!**

There are 2 files:

- `organizations.json` - contains the detail data for each organization in [JSON format](https://en.wikipedia.org/wiki/JSON)
- `managedAreas.geojson` - contains the data only relevant for the map in [GeoJSON format](https://en.wikipedia.org/wiki/GeoJSON). The data has to be as small as possible to keep the map fast. 

Update the each file depending on your need **without** changing the structure of the file and create pull request. To validate the changes you can use:

- [JSONLint](https://jsonlint.com/) to validate the `organizations.json` file
- [GeoJSON.io](http://geojson.io/) to validate the `managedAreas.geojson` file

## Adding new country

 If you cannot find the country (adding a organization from a new country) you need to add it tot eh geojson
 
 - Just copy paste a feature already in the geojson file and delete `geometry` field and adjust `properties` field accordingly (keep `ft: ma`)
 - You should get the `geometry` object for the country from [this list](https://github.com/AshKyd/geojson-regions/tree/master/countries/50m). Find your country and view the file in raw format (click `Raw` button on Github) and copy the url from browser. Then open [JSONHero](https://jsonhero.io/) and paste the url. This will format the JSON nicely and click on the `geometry` field on left and copy the entire value and paste it in your new feature in the geojson file.
 - Don't forget to add the organization to the `organizations.json` file as well.