var app = new Vue({
  el: "#app",

  data: {
    api: apiSigabem,

    tk: localStorage.getItem("SBTK"),

    demands: [],
    demandsShow: [],
    initialDate: '',
    finalDate: '',
    typeFeedback: ''
  },

  methods: {

    findDemands(){
       let body = {};

       if(this.typeFeedback !== "Todos"){
         body.tipo_demand = this.typeFeedback
       }

      const config = {
        headers: { Authorization: `Bearer ${this.tk}` },
      };

      this.api
      .post("demand/find", body, config)
      .then((resp) => {
        this.demands = resp.data.demand.map(deman => {
            return {
              ...deman, 
              data_reclamacao: new Date(deman.data_reclamacao)
            }
        })
        this.demandsShow = this.demands.filter(demand =>
          demand.data_reclamacao >= new Date(this.initialDate) &&
          demand.data_reclamacao <= new Date(this.finalDate) )
        
      })
      .catch((resp) => {});
    },

    max_date(all_dates) {
      let max_dt = all_dates[0]
      all_dates.forEach(function(dt, index)
        {
        if (  dt  >= max_dt)
        {
          max_dt = dt;
        }
        });
       return max_dt;
    },

    min_date(all_dates) {
      let min_dt = all_dates[0]
      all_dates.forEach(function(dt, index)
        {
          if (  dt  <= min_dt)
          {
            min_dt = dt;
          }
        });
       return min_dt;
    },


    convertArrayOfObjectsToCSV(args) {
      var result, ctr, keys, columnDelimiter, lineDelimiter, data;

      data = args.data || null;
      if (data == null || !data.length) {
        return null;
      }

      columnDelimiter = ",";
      lineDelimiter = "\n";

      keys = Object.keys(data[0]);

      result = "";
      result += keys.join(columnDelimiter);
      result += lineDelimiter;

      data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
          if (ctr > 0) result += columnDelimiter;

          result += item[key];
          ctr++;
        });
        result += lineDelimiter;
      });

      return result;
    },

    downloadCSV() {
      var data, filename, link;
      var csv = this.convertArrayOfObjectsToCSV({
        data: this.demandsShow.map((i) => {
          Object.assign(i, i.user);
          delete i.user;
          return i;
        }),
      });
      if (csv == null) return;

      filename = "export.csv";

      if (!csv.match(/^data:text\/csv/i)) {
        csv = "data:text/csv;charset=utf-8," + csv;
      }
      data = encodeURI(csv);

      link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", filename);
      link.click();
    },
  },

  mounted() {
    const config = {
      headers: { Authorization: `Bearer ${this.tk}` },
    };
    this.api
      .post("demand/find", {}, config)
      .then((resp) => {
        this.demands = resp.data.demand.map(deman => {
            return {
              ...deman, 
              data_reclamacao: new Date(deman.data_reclamacao)
            }
        })
        this.demandsShow = this.demands; 
        dates = this.demands.map(demand => demand.data_reclamacao)
        this.initialDate = this.min_date(dates).toISOString().substr(0, 10)

        this.finalDate = this.max_date(dates).toISOString().substr(0, 10)
        this.typeFeedback = "Todos"
      })
      .catch((resp) => {});
      
      
  
  
    },
});
