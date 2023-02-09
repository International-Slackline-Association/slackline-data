# Slackline Groups

This is a list of Slackline groups around the world. They are displayed on the [SlackMap](https://slackmap.com/communities).
If you think the data is incorrect or missing please try to add it yourself on github, if you can't do that, add your data [in this Form](https://forms.gle/ZpurHxHhUfj2yppg7).

If this also does not work, contact us here:
**Email**: slackmap@slacklineinternational.org


## How to add/modify data on Github

There are 2 files:
-   `groups.json` - contains the detail data for each group in [JSON format](https://en.wikipedia.org/wiki/JSON)
-   `groups.geojson` - contains the data only relevant for the map in [GeoJSON format](https://en.wikipedia.org/wiki/GeoJSON). The data has to be as small as possible to keep the map fast.

Update the each file depending on your need **without** changing the structure of the file and create pull request. To validate the changes you can use:
-  [JSONLint](https://jsonlint.com/) to validate the `groups.json` file
-  [GeoJSON.io](http://geojson.io/) to validate the `groups.geojson` file

**Warning**: If you add new data you **HAVE** to add the data to both files with unique `id` values. You can generate unique id from scratch with [Nanoid Generator](https://nanoid.jormaechea.com.ar/?length=7&quantity=1) (length is 7 characters). If you copy paste the `id` from another entry in the list it WILL NOT WORK. Also, the `coordinates` field in geojson files are in the order of [longitude, latitude]. So first value is longitude and second value is latitude - this is a common mistake when entering. Keep the `ft: sg` field in the geojson file.
