var app = new Vue({
	el: '#app',
	
	data: {
		linhas: [],
		errors: [],
		title: null,
		contents: null,
		notification_type: 'AVISO',
		destinatarios: 'TODOS',
		file: null,
		api: axios.create({
		    baseURL: "http://200.133.17.12:3000" //base da url da api
		}),
		linhaSelecionada: null,
	 },
	 
	 watch: {
		 
	 },
	 
	methods:{
		
		sendNotification(event) {
			event.preventDefault();
			 
			if(this.checkNotificationForm(event)){
				
				let formData = new FormData();
			    
			    formData.append('title', this.title);
			    formData.append('contents', this.contents);
			    formData.append('notification_type', this.notification_type);
			    formData.append('destinatarios', this.destinatarios);
				formData.append('line', this.linhaSelecionada);
			    formData.append('file', this.file);
			    
			    let config = {
		    		headers: {
		    			Authorization: 'Bearer ' + localStorage.getItem('SBTK')
		    		}
		        };
				
				try{
					
					this.api.post("/notification", formData, config).then((response) => {
						if(response.status == 201){
							alert(response.data.message);
						} else {
							alert(response.data.error);
						}
				    }). catch((error) => {
				    	alert(error);
				    });
				}catch{
					alert("Ocorreu um erro no serviço de notificações");
				}
			}
			 
		},
		 
		 checkNotificationForm: function (event) {
			 
			 if (this.title && this.contents && this.notification_type && this.destinatarios ){
				 return true;
			 }

			 this.errors = [];

			 if (!this.title) {
				 this.errors.push('O título é obrigatório.');
			 }
			 if (!this.contents) {
			 	this.errors.push('A mensagem é obrigatória.');
			 }
			 if (!this.notification_type) {
			 	this.errors.push('O tipo de notificação é obrigatório.');
			 }
			 if (!this.destinatarios) {
			 	this.errors.push('O destinatário é obrigatório.');
			 }

			 event.preventDefault();
		 },
		 
		 handleFile() {
			 this.file = this.$refs.file.files[0];
		 },
		 
		 getFavoritedLines() {
			 
			 let config = {
				 headers: {
					 Authorization: 'Bearer ' + localStorage.getItem('SBTK')
				 }
			 };
			 
			 this.api.post('/line/distinct/findall', {}, config).then((result) => {
				this.linhas = result.data;
			 }).catch((error) => {
			 });
		 }
		 
	 },
	 
	 mounted() {
	 
		 this.getFavoritedLines();
	}
	
});
