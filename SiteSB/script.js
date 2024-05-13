

let h2 = document.querySelector('h2')
var map, marker, circle;
let paradas = document.querySelector('#paradas')
let pessoas = document.querySelector('#pessoas')
var markers = L.layerGroup();
import municipios from './PE_Municipios_2022.js';
import bairros from './Bairros_RMR_Sirgas2000.js';


document.getElementById('pessoas').addEventListener('click', function () {
    var idade_min = document.getElementById('idade_min').value;
    var idade_max = document.getElementById('idade_max').value;
    var sexo = document.querySelector('input[name="sexo"]:checked').value;
    var deficiencia = document.querySelector('select[name="deficiencia"]').value;


    var url = new URL('http://localhost:8000/dados');
    var params = { sexo: sexo, tipo_defic: deficiencia, idade_min: idade_min, idade_max: idade_max };
    url.search = new URLSearchParams(params).toString();


    fetch(url)
        .then(response => response.json())
        .then(data => {

            markers.clearLayers();


            data.data.forEach(item => {
                var marker = L.marker([item[3], item[4]]);
                markers.addLayer(marker);
            });


            markers.addTo(map);
        })
        .catch(error => console.error('Error:', error));
});

function sucess(pos) {
    console.log(pos.coords.latitude, pos.coords.longitude)
    h2.textContent = `Latitude: ${pos.coords.latitude} Longitude: ${pos.coords.longitude}`

    if (map === undefined) {
        initializeMap(pos.coords.latitude, pos.coords.longitude);
    } else {
        map.remove()
        initializeMap(pos.coords.latitude, pos.coords.longitude);
    }
}

// ... código anterior ...

// Cria as camadas
var municipiosLayer = L.geoJson(municipios);
var bairrosLayer = L.geoJson(bairros);

function initializeMap(latitude, longitude) {
    map = L.map('map').setView([latitude, longitude], 16);
    markers.clearLayers();
    
    // Cria um objeto com as camadas de base
    var baseLayers = {
        "OpenStreetMap": L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),
        // Adicione aqui outras camadas de base se necessário
    };

    // Cria um objeto com as camadas de sobreposição
    var overlayLayers = {
        "Municipios": municipiosLayer,
        "Bairros": bairrosLayer,
        // Adicione aqui outras camadas de sobreposição se necessário
    };

    // Adiciona as camadas de base e de sobreposição ao mapa
    L.control.layers(baseLayers, overlayLayers).addTo(map);

    // Adiciona a camada de base padrão ao mapa
    baseLayers["OpenStreetMap"].addTo(map);

    // ... código restante ...
}

// ... código restante ...

function error(erro) {
    console.log(erro)
}


//var PE_Municipios_2022 = L.geoJson(PE_Municipios_2022).addTo(map);

var watchID = navigator.geolocation.watchPosition(sucess, error, {
    enableHighAccuracy: true,
    timeout: 5000,
})





