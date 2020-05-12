var app = new Vue({
  el: "#app",

  data: {
    layers: [],
    layersExibidas: [],
    todos: "",
    map: "",
    searchRadius: "350",
    location: {
      lat: "",
      lon: "",
    },
    loading: "visible",
    pesquisa: "",
    paradas: [],
    userIcon: L.icon({
      iconUrl: "../images/user_local.png",
      iconSize: [50, 50], // size of the icon
      iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    }),
    LayersIcons: {
      BusStopIcon: L.icon({
        iconUrl: "../images/bus-stop.png",
        iconSize: [50, 50], // size of the icon
        iconAnchor: [12, 25], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
      }),
      AuditivaIcon: L.icon({
        iconUrl: "../images/marker-icon-2x-violet.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
      IntelectualIcon: L.icon({
        iconUrl: "../images/marker-icon-2x-blue.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
      VisualIcon: L.icon({
        iconUrl: "../images/marker-icon-2x-red.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
      FisicaIcon: L.icon({
        iconUrl: "../images/marker-icon-2x-green.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
      MultiplaIcon: L.icon({
        iconUrl: "../images/marker-icon-2x-orange.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
    },
    estimativas: [],
  }, // end data

  watch: {
    todos: function (valor) {
      _self = this;
      this.map.removeLayer(this.paradas);
      let Lparadas = [];

      valor.map((stop) => {
        if (stop) {
          Lparadas.push(
            L.marker([stop.loc.lat, stop.loc.lon], {
              icon: this.LayersIcons.BusStopIcon,
            }).on("click", (ev) => {
              _self.estimativas = [
                { nome: "Carregando parada...", chegada: "" },
              ];

              axios
                .get(
                  `http://200.238.105.143:85/public/recife/stop/${stop.text}/estimations`
                )
                .then((res) => {
                  let estimativas = res.data.map((estimativa) => {
                    return {
                      linha: estimativa.line,
                      chegada: estimativa.arrivalTime,
                    };
                  });

                  axios
                    .get(`http://200.238.105.143:85/public/recife/lines`)
                    .then((linhas) => {
                      estimativas = estimativas.map((estimativa) => {
                        let linha = linhas.data.find((cadaLinha) => {
                          return cadaLinha.id == estimativa.linha;
                        });

                        let hora = eval(
                          "new " +
                            estimativa.chegada.replace("/", "").replace("/", "")
                        );
                        hora =
                          hora.getHours() +
                          ":" +
                          (hora.getMinutes() > 9
                            ? hora.getMinutes()
                            : "0" + hora.getMinutes());

                        return {
                          linha: estimativa.linha,
                          chegada: hora,
                          nome: linha.nombre.trim(),
                        };
                      });

                      if (estimativas.length) {
                        _self.estimativas = estimativas;
                      } else {
                        _self.estimativas = [
                          { nome: "Sem previsões para parada", chegada: "" },
                        ];
                      }
                    });
                });
            })
          );
        }
      });

      let lat = this.location.lat;
      let long = this.location.lon;
      var circle = L.circle([lat, long], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.3,
        radius: this.searchRadius,
      });

      Lparadas.push(circle);
      this.paradas = L.layerGroup(Lparadas);
      this.paradas.addTo(this.map);
      this.loading = "hidden";
    },
    location: function (atual) {
      this.map.setView([this.location.lat, this.location.lon], 17);
      this.buscarPontos();
    },
    layersExibidas: function (layersAtuais, layersAntigas) {
      layersAntigas.map((layer) => this.map.removeLayer(layer));
      layersAtuais.map((layer) => layer.addTo(this.map));
    },
  }, //end watch

  methods: {
    buscarPontos() {
      this.loading = "visible";
      document.getElementById("mapid").scrollIntoView();
      axios
        .get(
          `http://200.238.105.143:85/public/recife/stops?lat=${this.location.lat}&lon=${this.location.lon}&meters=${this.searchRadius}`
        )
        .then((response) => {
          this.getLinhas(response);
        });
    },

    getLinhas(resStop) {
      let _self = this;

      axios
        .all(
          resStop.data.map(function (result) {
            return axios
              .get(
                `http://200.238.105.143:85/public/recife/stop/${result}/lines`
              )
              .then(function (response) {
                return { text: result, line: response.data[0] };
              });
          })
        )
        .then(function (lista) {
          _self.getStopCords(lista, _self);
        });
    },

    getStopCords(resStopLine, self) {
      let _self = self;

      axios
        .all(
          resStopLine.map(function (result) {
            return axios
              .get(
                `http://200.238.105.143:85/public/recife/line/${result.line}`
              )
              .then(function (response) {
                if (response.data.stops) {
                  dataStop = response.data.stops.find(
                    (el) => el.label == result.text
                  );
                  return { text: result.text, loc: dataStop.location };
                }
              });
          })
        )
        .then(function (lista) {
          _self.todos = lista;
        });
    },

    redirecionar() {
      axios
        .get(
          `https://nominatim.openstreetmap.org/?addressdetails=1&q=${this.pesquisa}&format=json&limit=1`
        )
        .then((res) => {
          let locali = {
            lat: res.data[0].lat,
            lon: res.data[0].lon,
          };
          this.location = locali;
          console.log(locali);
          console.log(res);
        });
    },

    arcLayerMount(camadaNumber, layername, Licon, colorIcon) {
      let layer = [];
      axios
        .get(
          `https://thabit2.recife.ifpe.local/server/rest/services/sigabem/SIGABEM_2/MapServer/${camadaNumber}/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=user_nome_&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson`
        )
        .then((response) => {
          response.data.features.map((persona) => {
            if (persona.geometry.y && persona.geometry.x) {
              try {
                layer.push(
                  L.marker([persona.geometry.y, persona.geometry.x], {
                    icon: Licon,
                  }).bindPopup(persona.attributes.user_nome_)
                );
              } catch {
                console.warn(persona.attributes.user_nome_);
              }
            }
          });

          this.layers.push({
            name: "" + layername,
            geometry: L.layerGroup(layer),
            color: colorIcon,
            checked: false,
            Enable: true,
          });
        })
        .catch((e) => {
          this.layers.push({
            name: "Erro na camada: " + layername,
            geometry: layername + "Undefined",
            color: "rgba(170, 0, 0, 0.2)",
            checked: false,
            Enable: false,
          });
        });
    },
  }, //end methods

  mounted() {
    _self = this;

    navigator.geolocation.getCurrentPosition((position) => {
      this.location.lat = position.coords.latitude;
      this.location.lon = position.coords.longitude;

      this.map = L.map("mapid").setView(
        [this.location.lat, this.location.lon],
        17
      );
      L.tileLayer("http://c.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        this.map
      );
      L.marker([this.location.lat, this.location.lon], {
        icon: this.userIcon,
      }).addTo(this.map);

      this.map.on("click", function (ev) {
        let loc = {
          lat: ev.latlng.lat,
          lon: ev.latlng.lng,
        };

        _self.location = loc;
      });

      this.arcLayerMount(
        12,
        "Auditiva",
        this.LayersIcons.AuditivaIcon,
        "#9C2BCB"
      );
      this.arcLayerMount(13, "Fisica", this.LayersIcons.FisicaIcon, "#2AAD27");
      this.arcLayerMount(
        14,
        "Intelectual",
        this.LayersIcons.IntelectualIcon,
        "#2A81CB"
      );
      this.arcLayerMount(
        15,
        "Multipla",
        this.LayersIcons.MultiplaIcon,
        "#CB8427"
      );
      this.arcLayerMount(16, "Visual", this.LayersIcons.VisualIcon, "#CB2B3E");

      this.buscarPontos();
    });
  }, //end mounted
});
