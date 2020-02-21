axios.baseURL = "http://200.238.105.143:85/public/recife/"

var app = new Vue({
    el: '#app',

    data: {
      todos: '',
      map: '',
      searchRadius: "350",
      location:{
        lat: '',
        lon: ''
      },
      loading: "visible",
      pesquisa: "",
      paradas : [],
      userIcon: L.icon({
        iconUrl: '../assets/userLocal.png',
        iconSize:     [50, 50], // size of the icon
        iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      }),
      estimativas: [],
    },// end data



    watch:{
      todos:function(valor){ 
        this.map.removeLayer(this.paradas)
        _self = this;
        let Lparadas = [];
        valor.map(stop => {
            if(stop){
                Lparadas.push(L.marker([stop.loc.lat, stop.loc.lon])
                        .on('click', ev =>{
                          _self.estimativas=[{nome: "Carregando parada...", chegada: ""}]
                          axios.get(`http://200.238.105.143:85/public/recife/stop/${stop.text}/estimations`)
                          .then(res =>{
                            
                            let estimativas = res.data.map(estimativa => {
                                  return{
                                    linha: estimativa.line,
                                    chegada: estimativa.arrivalTime
                                  }
                                })

                            axios.get(`http://200.238.105.143:85/public/recife/lines`)
                                 .then(linhas =>{
                                  estimativas = estimativas.map(estimativa=>{
                                                let linha = linhas.data.find(cadaLinha =>{
                                                  return cadaLinha.id == estimativa.linha
                                                })

                                                let hora = eval("new " + estimativa.chegada.replace("/", "").replace("/", ""))
                                                hora = hora.getHours()+":"+ (hora.getMinutes() > 9 ? hora.getMinutes() : "0" + hora.getMinutes());

                                                return{
                                                  linha: estimativa.linha,
                                                  chegada: hora,
                                                  nome: linha.nombre.trim()
                                                }
                                              })
                                  if(estimativas.length){
                                    _self.estimativas = estimativas
                                  }else{
                                    _self.estimativas = [{nome: "Sem previsões para parada", chegada: ""}]
                                  }
                                 })

                          }) 
                        })
                        )
                        
            }         
        }) 

        let lat = this.location.lat
        let long = this.location.lon
        var circle = L.circle([lat, long], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.3,
            radius: this.searchRadius
        })

        Lparadas.push(circle)
        this.paradas = L.layerGroup(Lparadas)
        this.paradas.addTo(this.map)
        this.loading = "hidden"

      },
      location:function(atual){
          this.map.setView([this.location.lat, this.location.lon], 17);
          this.buscarPontos();
      },
      
    },//end watch



    methods:{
      buscarPontos(){
        this.loading = "visible"
        document.getElementById('mapid').scrollIntoView();
        axios.get(`http://200.238.105.143:85/public/recife/stops?lat=${this.location.lat}&lon=${this.location.lon}&meters=${this.searchRadius}`)
          .then(response => {
              this.getLinhas(response); 

            })
      },


      getLinhas(resStop){
        let _self = this;
        axios.all(resStop.data.map(function(result) {
          return axios.get(`http://200.238.105.143:85/public/recife/stop/${result}/lines`)
              .then(function (response) {
                  return {text: result, line: response.data[0]};
              }); 
        })).then(function(lista){
          _self.getStopCords(lista, _self)
         }); 
      },

      getStopCords(resStopLine, self){
        let _self = self;
        axios.all(resStopLine.map(function(result) {
          return axios.get(`http://200.238.105.143:85/public/recife/line/${result.line}`)
              .then(function (response) {
                //console.log(response)
                if(response.data.stops){
                  dataStop = response.data.stops.find(el => el.label == result.text)
                  return {text: result.text, loc: dataStop.location};
                }
              }); 
        })).then(function(lista){
          //console.log(lista)
          _self.todos = lista
         }); 
      },

      

      redirecionar(){
          console.log(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${this.pesquisa}&format=json&limit=1`)
          axios.get(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${this.pesquisa}&format=json&limit=1`)
          .then(res =>{
                let locali = {
                    lat: res.data[0].lat,
                    lon: res.data[0].lon
                }

                this.location = locali;
                console.log(locali);
                console.log(res)

          })
        
      }


    },//end methods




    mounted(){
      _self = this;
      navigator.geolocation.getCurrentPosition(position =>{
        this.location.lat = position.coords.latitude
        this.location.lon = position.coords.longitude

        this.map = L.map('mapid').setView([this.location.lat, this.location.lon], 17);
        L.tileLayer('http://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ).addTo(this.map);
        L.marker([this.location.lat, this.location.lon], {icon: this.userIcon}).addTo(this.map); 

        this.map.on('click', function(ev) {
          let loc={
              lat: ev.latlng.lat,
              lon: ev.latlng.lng
           }
          
        _self.location = loc
        });

        this.buscarPontos()
      })
      
    }//end mounted

  })



