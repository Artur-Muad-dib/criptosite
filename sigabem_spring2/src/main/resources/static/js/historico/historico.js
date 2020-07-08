var app = new Vue({
    el: "#app",
  
    data: {
      api: apiSigabem,
      tk: localStorage.getItem("SBTK"),
      notifications: [],
    },
  
    methods: {
  
  
    },
  
    async mounted() {
      const config = {
        headers: { Authorization: `Bearer ${this.tk}` },
      };
      const {data: {notification}} = await this.api.post("notification/find", {}, config)
      this.notifications =  notification;
    },
  });
  