var app = new Vue({
    el: "#app",
  
    data: {
      api: apiSigabem,
  
      tk: localStorage.getItem("SBTK"),
  
      stops: [],

      typeDeficits: [],
      typeDeficitsSelected: 'Todos',
    },
  
    methods: {
  
        findStops(){
            const config = {
            headers: { Authorization: `Bearer ${this.tk}` },
            };
    
            this.api
            .post("line/find/admin", {}, config)
            .then((resp) => {
                this.stops = resp.data.map(stop => {
                    return {
                    ...stop, 
                    data_criacao: new Date(stop.data_criacao)
                    }

                })
                this.typeDeficits = [...new Set(
                    resp.data.map(stop => stop.user.tipo_deficiencia)
                )];
            })   
            .catch((resp) => {});
        },

        findStopsByFilter(){
            const config = {
                headers: { Authorization: `Bearer ${this.tk}` },
              };

            let filter = {};

            if(this.typeDeficitsSelected !== "Todos"){
                filter = {
                    tipo_deficiencia: this.typeDeficitsSelected
                }
            }
        
            this.api
            .post("line/find/admin", filter , config)
            .then((resp) => {
                this.stops = resp.data.map(stop => {
                    return {
                    ...stop, 
                    data_criacao: new Date(stop.data_criacao)
                    }
    
                })
            })   
            .catch((resp) => {});
        },

        
    },
  
    mounted() {
        this.findStops();
    },
  });
  