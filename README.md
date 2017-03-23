## CARTO test solution WIP!
This simple project is an application that gives a solution for the problem proposed by CARTO 
in [Frontend CARTO test](https://gist.github.com/xavijam/8bf55f5e4da51bc79d94d676a471f77b).

### Introduction
Everything is written using plain Javascript but the part that renders the map, where I'm 
 using [Leaflet 1.0.3](http://leafletjs.com/2017/01/23/leaflet-1.0.3.html). For the frontend, 
 since it's said that CARTO has its own components, I simply use HTML and a bit of CSS.
 
Also, instead of reading the file result of the query proposed, I do an AJAX call to CARTO's server and 
 retrieve the Geo JSON data from there.
 
### The map
The map is built once the Geo data is retrieved. Since it could have lot of information, I've decided
 to start with a medium zoom, because if not the map loads more slowly. Related to this, I paint the markers
 asynchronously, so the map is painted almost immediately, and the markers appears in intervals. This way
 the user doesn't have to wait to see a map with some data, and the map doesn't get stalled. 
 
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
 
 
 
