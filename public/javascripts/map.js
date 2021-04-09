console.log('script OK');

var mymap = L.map('worldmap',
{
    center: [48.866667, 2.333333],
    zoom: 4
}
);

var customIcon = L.icon({
    iconUrl: '../images/leaf-green.png',
    shadowUrl: '../images/leaf-shadow.png',
   
    iconSize:   [38, 95],
    shadowSize:  [50, 64],
   
    iconAnchor:  [22, 94],
    shadowAnchor: [4, 62],  
   
    popupAnchor: [-3, -76]
   });

var listCities = document.getElementsByClassName('listCities');
for(let i =0; i<listCities.length; i++) {
 var lon = listCities[i].dataset.lon;
 var lat = listCities[i].dataset.lat;
 L.marker([lat, lon]/*, {icon: customIcon}*/).addTo(mymap).bindPopup(listCities[i].dataset.name);
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '(c) <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);