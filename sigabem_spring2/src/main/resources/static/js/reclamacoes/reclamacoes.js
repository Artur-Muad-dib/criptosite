var app = new Vue({
  el: "#app",

  data: {
    api: apiSigabem,

    tk: localStorage.getItem("SBTK"),

    demands: [],
  },

  methods: {
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
        data: this.demands.map((i) => {
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

    console.log(config);

    this.api
      .post("demand/find", {}, config)
      .then((resp) => {
        this.demands = resp.data.demand;
      })
      .catch((resp) => {});
  },
});
