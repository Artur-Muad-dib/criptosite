var app = new Vue({
    el: "#app",
  
    data: {
      api: apiSigabem,
      tk: localStorage.getItem("SBTK"),
      notifications: [],
      showNotifications: [],
      initialDate: '',
      finalDate: '',
      typeNotification: 'TODOS',
      typeGroup: 'TODOS',
      loading: true
    },
  
    methods: {

      findNotifications(){

        this.showNotifications = this.notifications;

        this.showNotifications = this.showNotifications.filter(notification =>
          notification.data_notificacao >= new Date(this.initialDate) &&
          notification.data_notificacao <= new Date(this.finalDate)
        )

        if(this.typeNotification !== 'TODOS'){
          this.showNotifications = this.showNotifications.filter(notification =>
          notification.notification_type === this.typeNotification)
        }

        if(this.typeGroup !== 'TODOS'){
          this.showNotifications = this.showNotifications.filter(notification =>
          notification.destinatarios === this.typeGroup)
        }



      },
      
      max_date(all_dates) {
        let max_dt = all_dates[0]
        all_dates.forEach(function(dt, index){
          if (  dt  >= max_dt){
            max_dt = dt;
          }
        });
        return max_dt;
      },

      min_date(all_dates) {
        let min_dt = all_dates[0]
        all_dates.forEach(function(dt, index){
            if (  dt  <= min_dt){
              min_dt = dt;
            }
        });
        return min_dt;
      },
  
    },
  
    async mounted() {
      const config = {
        headers: { Authorization: `Bearer ${this.tk}` },
      };
      const {data: {notification}} = await this.api.post("notification/find", {}, config)
      this.notifications =  notification.reverse().map(not => {
        return {
          ...not, 
          data_notificacao: new Date(not.data_notificacao)
        }
      });
      this.showNotifications = this.notifications;
      let dates = this.notifications.map(not => not.data_notificacao)
      this.initialDate = this.min_date(dates)?.toISOString().substr(0, 10)
      this.finalDate = this.max_date(dates)?.toISOString().substr(0, 10)
      this.loading = false;
    },
  });
  