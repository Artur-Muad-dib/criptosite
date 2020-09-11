const api = axios.create({
    baseURL: "http://200.133.17.12:3000" //base da url openSignal
});


$( "#sendFormNotification" ).click(function (ev){

    ev.preventDefault();
    
    let title= document.getElementById("title").value;
    let contents = document.getElementById("contents").value;
    let notification_type = document.getElementById("notification_type").value;
    let destinatarios = document.getElementById("destinatarios").value;
    
    let formData = new FormData();
    
    formData.append('title', title);
    formData.append('contents', contents);
    formData.append('notification_type', notification_type);
    formData.append('destinatarios', destinatarios);
    formData.append('file', document.querySelector('#file').files[0]);
    
    let config = {
		headers: {
			Authorization: 'Bearer ' + localStorage.getItem('SBTK')
		}
    };

	api.post("/notification", formData, config).then((response) => {
    }). catch((error) => {
    });
});
