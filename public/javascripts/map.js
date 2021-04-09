console.log('script OK');

var mymap = L.map('worldmap',
{
    center: [48.866667, 2.333333],
    zoom: 4
}
);


var listCities = document.getElementsByClassName('listCities');
for(let i =0; i<listCities.length; i++) {
    var lon = listCities[i].dataset.lon;
    var lat = listCities[i].dataset.lat;
    var image = listCities[i].dataset.image;
    
    var customIcon = L.icon({
        iconUrl: image,
       
        iconSize:   [50, 50],
       
        

       
        popupAnchor: [-1, -20]
       });
    
 L.marker([lat, lon], {icon: customIcon}).addTo(mymap).bindPopup(listCities[i].dataset.name);
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '(c) <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);