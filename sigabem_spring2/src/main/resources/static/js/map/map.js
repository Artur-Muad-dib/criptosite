var app = new Vue({
  el: "#app",

  data: {

    config: {
      headers: { Authorization: `Bearer ${localStorage.getItem("SBTK")}` },
    },

    stops: [],
    marcarTodos: false,

    map: "",
    markerUser: "",
    layerOpenStreet: "",
    layerBairros: "",
    layerParadas: [],
    layerPCDs: "",
    layerCalcadas: "",
    layerMunicipios: "",
    layerUsers: "",

    searchRadius: "350",

    location: {
      lat: -8.063169,
      lon: -34.871139,
    },

    loading: false,
    pesquisa: "",

    lowerAge: 5,
    upperAge: 45,
    maxAge: 100,
    minAge: 1,

    sexos: [],

    deficits: ["AUDITIVA", "INTELECTUAL", "VISUAL", "MULTIPLA", "FISICA"],
    deficitsSelect: [],

    bairros: [],
    bairrosSelect: [],

    info: "",
    control: "",

    userIconTest: L.icon({
      iconUrl: "/sigabem/images/user_local.png",
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [-3, 0],
    }),
    userIcon: L.icon({
      iconUrl: "/sigabem/images/user_local.png",
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [-3, 0],
    }),
    BusStopIcon: L.icon({
      iconUrl: "/sigabem/images/bus-stop.png",
      iconSize: [50, 50],
      iconAnchor: [8, 40],
      popupAnchor: [15, -20],
    }),

    CavaleteIcon: L.icon({
      iconUrl: "/sigabem/images/cavalete.png",
      iconSize: [50, 50],
      iconAnchor: [8, 40],
      popupAnchor: [15, -20],
    }),

    AppUserIcon: L.icon({
      iconUrl: "/sigabem/images/user.png",
      iconSize: [50, 50],
      iconAnchor: [8, 40],
      popupAnchor: [15, -20],
    }),

    deficientsIcons: {
      AUDITIVA: "violet",
      INTELECTUAL: "blue",
      VISUAL: "red",
      FISICA: "green",
      MULTIPLA: "orange",
    },

    estimativas: [],
  }, // end data

  watch: {
    marcarTodos(atual) {
      if (atual) {
        let r = confirm(
          "Filtrar com todos os bairros selecionados pode travar o sistema, deseja continuar?"
        );
        if (r == true) {
          this.bairrosSelect = [...this.bairros];
        }
      } else {
        this.bairrosSelect = [];
      }
    },

    lowerAge(atual) {
      if (this.lowerAge > this.upperAge) {
        this.lowerAge = this.upperAge;
      }
    },
    upperAge(atual) {
      if (this.upperAge < this.lowerAge) {
        this.upperAge = this.lowerAge;
      }
    },

    stops: function (valor) {
      _self = this;
      let Lparadas = [];
      valor.map((stop) => {
        if (stop) {
          Lparadas.push(
            L.marker([stop.loc.lat, stop.loc.lon], { icon: this.BusStopIcon })
              .bindPopup(`<p>${stop.text}</p>`)
              .on("click", (ev) => {
                _self.estimativas = [
                  { nome: "Carregando parada...", chegada: "" },
                ];
                apiSigabemMaps
                  .get(`/estimativas?stop=${stop.text}`)
                  .then((res) => {
                    let estimativas = res.data.map((estimativa) => {
                      return {
                        linha: estimativa.line,
                        chegada: estimativa.arrivalTime,
                      };
                    });

                    apiSigabemMaps.get(`/linhas`).then((linhas) => {
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
        color: "#28D8A1",
        fillColor: "#28D8A1",
        fillOpacity: 0.1,
        radius: this.searchRadius,
      });

      Lparadas.push(circle);
      this.layerParadas.clearLayers();
      this.layerParadas.addLayer(L.layerGroup(Lparadas));

      this.loading = false;
    },
    location: function (atual) {
      this.map.setView([this.location.lat, this.location.lon], 17);
    },
    layersExibidas: function (layersAtuais, layersAntigas) {
      layersAntigas.map((layer) => this.map.removeLayer(layer));
      layersAtuais.map((layer) => layer.addTo(this.map));
    },
  }, //end watch

  methods: {
    async buscarPontos() {
      this.loading = true;
      document.getElementById("mapid").scrollIntoView();
      let pontos;
      try {
        pontos = await apiSigabemMaps.get(
          `/stops?lat=${this.location.lat}&lon=${this.location.lon}&meters=${this.searchRadius}`
        );
      } catch {
        alert("Ocorreu um erro no serviço de paradas");
        this.loading = false;
        return;
      }
      this.stops = pontos.data;
      this.loading = false;
    },

    async getBairros() {
      _self = this;
      const style = {
        fillColor: "#810127",
        weight: 2,
        opacity: 1,
        color: "#800026",
        dashArray: "3",
        fillOpacity: 0.2,
      };

      function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
          weight: 5,
          color: "#810127",
          dashArray: "",
          fillOpacity: 0.7,
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }

        _self.info.update(layer.feature.properties);
      }

      function resetHighlight(e) {
        var layer = e.target;

        layer.setStyle(style);
        _self.info.update();
      }

      function zoomToFeature(e) {
        _self.map.fitBounds(e.target.getBounds());
      }

      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature,
        });
      }

      let bairros = await apiSigabemMaps.get("/bairros");

      this.bairros = bairros.data.map((bairro) => bairro.bairro).sort();

      bairros = bairros.data.map((bairro, index) => {
        return {
          type: "Feature",
          id: index,
          properties: {
            type: "bairro",
            name: bairro.bairro,
          },
          geometry: JSON.parse(bairro.geometry),
        };
      });
      this.layerBairros.clearLayers();
      this.layerBairros.addLayer(
        L.geoJson(
          { type: "FeatureCollection", features: bairros },
          { style: style, onEachFeature: onEachFeature }
        )
      );
    },

    redirecionar() {
      apiNominatin
        .get(`/?addressdetails=1&q=${this.pesquisa}&format=json&limit=1`)
        .then((res) => {
          let locali = {
            lat: res.data[0].lat,
            lon: res.data[0].lon,
          };

          this.location = locali;
        });
    },

    async getCalcadas() {
      let layer = [];
      _self = this;
      let response;
      try {
        response = await apiSigabemMaps.get("/calcadas");
      } catch {
        alert("Ocorreu um erro no serviço de Calçadas reformadas");
        this.loading = false;
        return;
      }

      const lista = await Promise.all(
        response.data.result.records.map((result) => {
          let baseURI = `/?addressdetails=1&q=${result.bairro
            .replace("(", "")
            .replace(")", "")} ${result.logradouro
            .replace("(", "")
            .replace(")", "")
            .replace("mutirão", "")}&format=json&limit=1`;
          return apiNominatin.get(baseURI).then(function (response2) {
            return Object.assign({ URI: baseURI }, response2.data[0], result);
          });
        })
      );
      let count = "";
      lista.map((item) => {
        try {
          layer.push(
            L.marker([item.lat, item.lon], { icon: this.CavaleteIcon })
              .bindPopup(`<h4>${item.bairro},${item.logradouro}</h4>
                                    <h5>Percentual: ${item.percentual_concluido}</h5>
                                    <h5>Status: ${item.status}</h5>
                                    <p>${item.observacao}</p>
                                    `)
          );
        } catch {
          count += `${item._id} ${item.logradouro} ${item.bairro}\n`;
        }
      });
      this.layerCalcadas.clearLayers();
      this.layerCalcadas.addLayer(L.layerGroup(layer));
    },

    getLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        let locali = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        this.markerUser.setLatLng(locali);
        this.location = locali;
      });
    },

    async getMunicipios() {
      _self = this;
      const style = {
        fillColor: "#67fe90",
        weight: 2,
        opacity: 1,
        color: "#408026",
        dashArray: "3",
        fillOpacity: 0.2,
      };

      function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
          fillColor: "#67fe90",
          weight: 5,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.7,
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }

        _self.info.update(layer.feature.properties);
      }

      function resetHighlight(e) {
        var layer = e.target;

        layer.setStyle(style);
        _self.info.update();
      }

      function zoomToFeature(e) {
        _self.map.fitBounds(e.target.getBounds());
      }

      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature,
        });
      }

      let municipios = await apiSigabemMaps.get("/municipios");

      municipios = municipios.data.map((municipio, index) => {
        return {
          type: "Feature",
          id: index,
          properties: {
            type: "municipio",
            name: municipio.nome,
            pop: municipio["população"],
            dens: municipio.dens_demo,
          },
          geometry: JSON.parse(municipio.geometry),
        };
      });
      this.layerMunicipios.clearLayers();
      this.layerMunicipios.addLayer(
        L.geoJson(
          { type: "FeatureCollection", features: municipios },
          { style: style, onEachFeature: onEachFeature }
        )
      );
    },

    async getUsers() {
      const { data: { found: { users } } }=  await apiSigabem.post("/users/find", {}, this.config)

      const usersFilters = users.filter(user => (Boolean(Number(user.endereco.longitude)) && Boolean(Number(user.endereco.latitude))))

      const usersMarkers = usersFilters.map((user) => {
        return L.marker([ user.endereco.latitude, user.endereco.longitude ], {
          icon: this.AppUserIcon,
        })
        .bindPopup(
            `
              <h4>${user.nome}</h4>
              <h5>${user.email}</h5>
              <strong>CPF:</strong> ${user.cpf}</br>
              <strong>Deficiencia:</strong> ${
                user.tipo_deficiencia
              }
              </br>
            `
          );

        });


        this.layerUsers.clearLayers();
        this.layerUsers.addLayer(L.featureGroup(usersMarkers));

    },

    async filtrarPCDs() {
      if (
        !(
          this.bairrosSelect.length &&
          this.sexos.length &&
          this.deficitsSelect.length
        )
      ) {
        alert("Preencha todos os campos");
        return;
      }

      this.loading = true;
      const filter = {
        minAge: this.lowerAge,
        maxAge: this.upperAge,
        district: this.bairrosSelect,
        gender: this.sexos,
        deficit: this.deficitsSelect,
      };

      let pcds = await apiSigabemMaps.post("/pcd", filter);

      if (pcds.data.length <= 0) {
        alert("A pesquisa não retornou nenhum resultado, mude os filtros");
        this.loading = false;
        return;
      }
      pcds = pcds.data.map((pcd) => {
        let modify_pcd = { ...pcd };
        modify_pcd.lat = JSON.parse(modify_pcd.geometry).coordinates[0];
        modify_pcd.lon = JSON.parse(modify_pcd.geometry).coordinates[1];

        return L.marker([modify_pcd.lon, modify_pcd.lat], {
          icon: this.pcdsIcons(modify_pcd.deficiencia),
        }).bindPopup(`<h5>${modify_pcd.nome}</h5>
                                    <strong>CPF:</strong> ${modify_pcd.cpf}</br>
                                    <strong>Deficiencia:</strong> ${
                                      modify_pcd.deficiencia
                                    } </br> 
                                    <strong>Local:</strong> ${
                                      modify_pcd.place
                                    }</br>
                                    <strong>Sexo:</strong> ${
                                      modify_pcd.sexo == "M"
                                        ? "Masculino"
                                        : "Feminino"
                                    } </br>
                                    <strong>Idade:</strong> ${
                                      modify_pcd.idade
                                    }</br>`);
      });

      this.layerPCDs.clearLayers();
      this.layerPCDs.addLayer(L.featureGroup(pcds));
      _self.map.fitBounds(this.layerPCDs.getBounds());
      this.loading = false;
    },

    pcdsIcons(deficiencia) {
      return L.icon({
        iconUrl: `/sigabem/images/marker-icon-2x-${this.deficientsIcons[deficiencia]}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
    },
  }, //end methods

  mounted() {
    this.map = L.map("mapid").setView(
      [this.location.lat, this.location.lon],
      17
    );

    let token =
      "pk.eyJ1IjoiYXJ0aHVydHJpaXMxIiwiYSI6ImNrNmduZHJ4NzB5ejgza3A2czBmbWttYmIifQ.vStvcH5ZvTN04wfLjuKtNA";
    this.layerGray = L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" +
        token,
      {
        id: "mapbox/light-v9",
        tileSize: 512,
        zoomOffset: -1,
      }
    ).addTo(this.map);

    this.layerOpenStreet = L.tileLayer(
      "http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ).addTo(this.map);
    this.markerUser = L.marker([this.location.lat, this.location.lon], {
      icon: this.userIcon,
    }).addTo(this.map);
    this.layerParadas = L.featureGroup([]).addTo(this.map);
    this.layerPCDs = L.featureGroup([]).addTo(this.map);
    //this.layerCalcadas = L.featureGroup([]).addTo(this.map);
    this.layerBairros = L.featureGroup([]).addTo(this.map);
    this.layerMunicipios = L.featureGroup([]).addTo(this.map);
    this.layerUsers = L.featureGroup([]).addTo(this.map);

    this.info = L.control();

    this.info.onAdd = function (map) {
      this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
      this.update();
      return this._div;
    };

    this.info.update = function (props) {
      this._div.innerHTML;
      if (props) {
        if (props.type == "bairro") {
          this._div.innerHTML = "<b>" + props.name + "</b>";
        } else if (props.type == "municipio") {
          this._div.innerHTML =
            "<b>" +
            props.name +
            "</b> </br> <b>População:" +
            props.pop +
            "</b> </br> <b>Densidade demografica:" +
            props.dens +
            "</b>";
        }
      } else {
        this._div.innerHTML = "Região Metropolitana do Recife";
      }
    };

    this.info.addTo(this.map);

    this.map.on("dblclick", (ev) => {
      this.location = { lat: ev.latlng.lat, lon: ev.latlng.lng };
      this.buscarPontos();
    });

    this.getLocation();
    this.getBairros();
    //this.getCalcadas();
    this.getUsers();
    this.getMunicipios();

    let baseMaps = {
      Cinza: this.layerGray,
      OpenStreetMap: this.layerOpenStreet,
    };

    let overlayMaps = {
      //Calçadas: this.layerCalcadas,
      Municipios: this.layerMunicipios,
      Bairros: this.layerBairros,
      Paradas: this.layerParadas,
      PCDs: this.layerPCDs,
      Usuarios: this.layerUsers
    };

    this.control = L.control.layers(baseMaps, overlayMaps).addTo(this.map);
  }, //End mounted()
});
