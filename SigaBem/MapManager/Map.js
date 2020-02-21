axios.baseURL = "http://200.238.105.143:85/public/recife/"

var app = new Vue({
    el: '#app',

    data: {
      todos: '',
      map: '',
      searchRadius: "600",
      location:{
        lat: '',
        lon: ''
      },
      loading: "visible",
      pesquisa: "",
      paradas : []
    },// end data



    watch:{
      todos:function(valor){ 
        this.map.removeLayer(this.paradas)
        _self = this;
        let Lparadas = [];
        valor.map(stop => {
            if(stop){
                Lparadas.push(L.marker([stop.loc.lat, stop.loc.lon]).bindPopup(stop.text));
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
          this.map.setView([this.location.lat, this.location.lon], 16);
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

        this.map = L.map('mapid').setView([this.location.lat, this.location.lon], 16);
        L.tileLayer('http://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ).addTo(this.map);
        L.marker([this.location.lat, this.location.lon]).addTo(this.map); 

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



