var mapa;
var raioBusca = "350";
var carregando = "visible";
var paradas = [];
//var estimativas = [];
var localizacao = {
	lat: '',
	lon: ''
};
var url = "http://200.238.105.143:85/public/recife/";

var localizacaoProxy = new Proxy(localizacao, {
	set: function (target, key, value) {
		localizacao = value;
		watchingVariable(key);
		return true;
	}
});

// Quando a página carregar, realizará a busca de das paradas e linhas de ônibus e adiciona-os ao mapa
$(document).ready(function() {
	setMap();
});

function setMap(){
	
	// Criando o ícone personalizado da localização do usuário
	var userIcon = L.icon({
		iconUrl: '../images/user_local.png',
		iconSize:     [50, 50], // size of the icon
		iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
		popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
	})
      
	// Capturando a localização do usuário (aproximada) 
	navigator.geolocation.getCurrentPosition( position => {
		
		// Atualiza a latitude e longitude
		localizacao.lat = position.coords.latitude;
		localizacao.lon = position.coords.longitude;
		
		// Cria o mapa do leaflet com a localização do usuário, com zoom de 17
		mapa = L.map('mapid').setView([localizacao.lat, localizacao.lon], 17);
		
		// Adiciona o título do mapa 
		L.tileLayer('http://c.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);
		
		// Adiciona o marcador de posição do usuário ao mapa
		L.marker([localizacao.lat, localizacao.lon], {icon: userIcon}).addTo(mapa); 

		// O que irá acontecer ao clicar no mapa?
		mapa.on('click', function(ev) {
			var novaLocalizacao = {
				lat: ev.latlng.lat,
				lon: ev.latlng.lng
			}
			  
			// Ao clicar no mapa atualiza a localização
			localizacaoProxy.localizacao = novaLocalizacao
		});
	
		// Realiza a pesquisa das paradas de ônibus
		buscarPontos()
	});
}

function buscarPontos(){
	
	// Exibe o icone de carregamento
	carregando = "visible";
	
	// Faz o scroll para a posição que o usuário clicou
	document.getElementById('mapid').scrollIntoView();
	
	// Realiza a pesquisa das paradas
	axios.get("http://200.238.105.143:85/public/recife/stops?lat=" + localizacao.lat + "&lon=" + localizacao.lon + "&meters=" + raioBusca)
		.then(response => {
			// Ao terminar a pesquisa e já ter o resultado
			// realiza a pesquisa pelas linhas
		    getLinhas(response); 
		});
}

function getLinhas(responseParadas){
	
	axios.all(responseParadas.data.map(function(paradaAtual) {
		
		// Para cada parada retornada da função anterior
		// Realiza a pesquisa das linhas que passam na parada
		return axios.get("http://200.238.105.143:85/public/recife/stop/" + paradaAtual + "/lines")
        	.then(function (response) {
            	return {parada: paradaAtual, linha: response.data[0]};
            }); 
	})).then(function(lista){
    	  getCoordenadasParadas(lista);
	});
}

function getCoordenadasParadas(responseLinhas){
	
	axios.all(responseLinhas.map(function(linhaAtual) {
		return axios.get("http://200.238.105.143:85/public/recife/line/" + linhaAtual.linha)
			.then(function (response) {
				if(response.data.stops){
					var dataStop = response.data.stops.find(el => el.label == linhaAtual.parada)
					return {parada: linhaAtual.parada, localizacao: dataStop.location};
				}
		}); 
	})).then(function(lista){
		adicionarCamada(lista);
	});
}

function adicionarCamada(valor) {
	
	estimativas.add({"linha": 123, "nome": "Teste", "chegada": "Hora"})
	
    mapa.removeLayer(paradas);
    var Lparadas = [];
    
	valor.map(stop => {
		
		if(stop){
			Lparadas.push(L.marker([stop.localizacao.lat, stop.localizacao.lon]).on('click', ev => {

				estimativas = [{nome: "Carregando parada...", chegada: ""}];
				      
				axios.get("http://200.238.105.143:85/public/recife/stop/" + stop.parada + "/estimations").then(res => {

					var novaEstimativas = res.data.map(estimativa => {
						return {
							linha: estimativa.line,
							chegada: estimativa.arrivalTime
						}
					})

					axios.get("http://200.238.105.143:85/public/recife/lines").then(linhas => {
						novaEstimativas = novaEstimativas.map(estimativaAtual => {
								 
							var linha = linhas.data.find(cadaLinha =>{
							  return cadaLinha.id == estimativaAtual.linha
							})
							
							var hora = eval("new " + estimativaAtual.chegada.replace("/", "").replace("/", ""));
							hora = hora.getHours() + ":" + (hora.getMinutes() > 9 ? hora.getMinutes() : "0" + hora.getMinutes());
							
							return {
								linha: estimativaAtual.linha,
								chegada: hora,
								nome: linha.nombre.trim()
							};
						});
						  
						if(novaEstimativas.length) {
							estimativas = novaEstimativas
						} else {
							estimativas = [{nome: "Sem previsões para parada", chegada: ""}]
						}
					})
				})
			}))
		}    
    })

    // Atualiza a latitude e longitude
    var lat = localizacao.lat;
    var long = localizacao.lon;
    
    // Criando o círculo com raio de 350 metros
    var circle = L.circle([lat, long], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3,
        radius: raioBusca
    })

    // Adicionando o círculo no mapa
    Lparadas.push(circle);
    
    // Criando um grupo de camadas com as paradas
    paradas = L.layerGroup(Lparadas);
    
    // Adicionando as paradas ao mapa
    paradas.addTo(mapa);
    
    // Esconde o ícone de carregamento
    carregando = "hidden";
}

function redirecionar() {
    
    axios.get("https://nominatim.openstreetmap.org/?addressdetails=1&q=${this.pesquisa}&format=json&limit=1").then(response => {
			
		if(response.data.length != 0){
			
			var novaLocalizacao = {
				lat: response.data[0].lat,
				lon: response.data[0].lon
			}
			
			localizacaoProxy.localizacao = novaLocalizacao
		} else {
			alert("O local pesquisado não foi encontrado.");
		}	
	});
}

function watchingVariable(atual) {
	mapa.setView([localizacao.lat, localizacao.lon], 17);
	buscarPontos();
}