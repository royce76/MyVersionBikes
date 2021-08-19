# Salesforce DX Project: My VersionBikes

This project aims to create a toolbox. You will find for each component a source link to its Js,HTML,XML file.

## To use It in your Playground.

Get [Ebikes-lwc](https://github.com/trailheadapps/ebikes-lwc) repository in the sample Gallery. Follow the guide to setup it as Salesforce do.

## App manager, lightning app builder

Create your own app with a home page. And play with my component.

### List all bikes in a lightning card filtered with tiles with one REQUEST Apex

- This list of all bikes is displayed in tiles for each bike. You can filter it with only one request Apex instead of Salesforce do in the ebikes app.
- [Filter-component](https://github.com/royce76/MyVersionBikes/tree/master/force-app/main/default/lwc/myProductFilter)
- [ListTile-component](https://github.com/royce76/MyVersionBikes/tree/master/force-app/main/default/lwc/myProductList)
- [OneTile-component](https://github.com/royce76/MyVersionBikes/tree/master/force-app/main/default/lwc/myProductTile)

### Use the same filter for the Datatable (One single row edited)

- Even the datatable is edited, saved and refresh, the filter keep the same state.
- [Filter-component](https://github.com/royce76/MyVersionBikes/tree/master/force-app/main/default/lwc/myProductFilter)
- [Datatable-component](https://github.com/royce76/MyVersionBikes/tree/master/force-app/main/default/lwc/myBikesTable)

### CustomType in Datatable

- Put an image in a column, use the customType.
- [CustomType-Component](https://github.com/royce76/MyVersionBikes/tree/master/force-app/main/default/lwc/myCustomTypes)
