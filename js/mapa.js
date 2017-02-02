var map;
var idInfoBoxAberto;
var infoBox = [];
var markers = [];

function initialize() {	
	var centro = {lat:-5.057573, lng:-42.794717};

	var latlng = new google.maps.LatLng(centro);
	
    var options = {
        zoom: 17,
	center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("mapa"), options);
}

initialize();

function abrirInfoBox(id, marker) {
	if (typeof(idInfoBoxAberto) == 'number' && typeof(infoBox[idInfoBoxAberto]) == 'object') {
		infoBox[idInfoBoxAberto].close();
	}

	infoBox[id].open(map, marker);
	idInfoBoxAberto = id;
}

function carregarPontos() {
	
	$.getJSON('js/ufpimaps.json', function(pontos) {
		
		var latlngbounds = new google.maps.LatLngBounds();
		
		$.each(pontos, function(index, ponto) {
			var pontoDegree = {lat: ponto.localization.latitude, lng: ponto.localization.longitude};
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(pontoDegree),
				title: ponto.nome,
				label: ponto.nome, 
				icon: 'img/marcador.png'
			});
			
			var myOptions = {
				content: "<p>" + ponto.descricao + "</p>",
				pixelOffset: new google.maps.Size(-150, 0)
        	};

			infoBox[ponto.id] = new InfoBox(myOptions);
			infoBox[ponto.id].marker = marker;
			
			infoBox[ponto.id].listener = google.maps.event.addListener(marker, 'click', function (e) {
				abrirInfoBox(ponto.id, marker);
			});
			
			markers.push(marker);
			
			latlngbounds.extend(marker.position);
			
		});
		
		var markerCluster = new MarkerClusterer(map, markers);
		
		map.fitBounds(latlngbounds);
		
	});
	
}
carregarPontos();
