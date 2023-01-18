# Slackline Communities

This is a list of Slackline communities around the world. They are displayed on the [SlackMap](https://slackmap.com/communities).
If you think the data is incorrect or missing please contact ISA.

**Email**: slackmap@slacklineinternational.org


## How to add/modify data

There are 2 files:
-   `communities.json` - contains the detail data for each community in [JSON format](https://en.wikipedia.org/wiki/JSON)
-   `communities.geojson` - contains the data only relevant for the map in [GeoJSON format](https://en.wikipedia.org/wiki/GeoJSON). The data has to be as small as possible to keep the map fast.

Update the each file depending on your need **without** changing the structure of the file and create pull request. To validate the changes you can use:
-  [JSONLint](https://jsonlint.com/) to validate the `communities.json` file
-  [GeoJSON.io](http://geojson.io/) to validate the `communities.geojson` file

**Warning**: If you add new data you **HAVE** to add the data to both files with unique `id` values. You can generate unique id with [Nanoid Generator](https://nanoid.jormaechea.com.ar/?length=7&quantity=1) (length is 7 characters). If you copy paste the `id` from another in the list it WILL NOT WORK. Also, `coordinates` field in geojson files are in order of [longitude, latitude]. So first value is longitude and second value is latitude. 