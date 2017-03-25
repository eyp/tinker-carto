## CARTO test solution
This simple project is an application that gives a solution for the problem proposed by CARTO 
in[Frontend CARTO test](https://gist.github.com/xavijam/8bf55f5e4da51bc79d94d676a471f77b).

### Setup
After cloning the project it's needed to copy or rename config-sample.js to config.js and provide a Mapbox
access token and a Mapbox project id.

### Some decisions
First of all, I must say that I'm not an expert working on maps, I've done just one or two things on side projects :).

Everything is written using plain Javascript but the part that renders the map, where I'm 
 using[Leaflet 1.0.3](http://leafletjs.com/2017/01/23/leaflet-1.0.3.html). For the frontend, 
 since it's said that CARTO has its own components, I simply use HTML and a bit of CSS.
 
Also, instead of reading the file result of the query proposed, I do an AJAX call to CARTO's server and 
 retrieve the Geo JSON data from there.
 
The application consists on 3 main classes: App, Map and LeafletFacade, so the interface (index.html) only depends
on App, App depends on Map and Map on LeafletFacade, as a typical n-tier layer application.

UI --> App --> Map --> LeafletFacade

         |
          ---> CartoFacade

The purpose of LeafletFacade to isolate the library used. This is the only class that depends directly on the library 
used to manage the map, and it could be replaced more or less easily.
 
The map is built once the Geo data is retrieved. All records are in a[FeatureGroup](http://leafletjs.com/reference.html#featuregroup).
This way they can be shown all at once, and the map is shown faster than if I had add each marker to the map individually.
Also, with this class is possible to bring to front or back the markers layer with a function call.

### The map
 
The size of the markers are based on the **feature.properties.rank_max** property. Higher the rank, bigger the marker.
Also I've tried to make a kind of _choropleth_ map, assigning a different opacity to the dots, based on the 
**feature.properties.rank_max** property again.
 
I've added several controls in order to change the map. They are described by themselves:

* Theme: You can choose different themes for the map.
* Dots color: Changes the color of the data represented.
* Dots size: Increments or decrements the size of the dots.
* Stroke color: Changes the color of the dots' border.
* Stroke size: Changes the thickness of the dots' border.
 
When you click on a marker a popup is shown with the city's name, the country, the max and min population, and the 
max rank assigned in the Geo data (_feature.properties.rank_max_ property). 
 
As a little bonus, I've added the flag of the country in the marker's popup. For this I've used the **feature.properties.adm0_a3**
property, that I guess follows the _ISO 3166-1 alpha-3_ standard codification. For the flags I use the ones that I've found in 
Github's project (https://github.com/adamoliver/Country-Flags-ISO-3).
 
### Answering the questions
**How would you implement a choropleth map?**

 Well, as I've explained, I've tried to do it in the current map, but obviously, I don't 
 have the resources right now to draw the surfaces of every region or city within the Geo JSON data. So what I've done, is using
 one of the properties of the records (rank_max) that I assumed it was for representing the population density of a record. Then I've
 given more importance to that record setting more opacity and size to the marker.
 Making the markers huge you will be able to appreciate the difference between more dense cities, and less dense ones.
  
**Do you feel a legend would be needed?** 

  In the current map, I don't think a legend is needed. But if we want one, we could add
  a legend to tell the user why some markers are bigger than others, and why their colors are more intense.

**We love Easter eggs**

  It isn't a good easter egg at all, I just added the flags as a bonus to the map, but after thinking a little bit 
  I decided to add a small thing, just zoom in... Of course working with map's events I could have add another kind of
   thing like a videogame, beatiful girl/ handsome boy picture, etc., but hey, it's something! 