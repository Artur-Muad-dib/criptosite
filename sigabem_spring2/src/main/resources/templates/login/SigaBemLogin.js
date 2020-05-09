
const api = axios.create({
  baseURL: 'http://200.133.17.12:3000',
});


$( "#btnLogin" ).click(function() {


    let cpf = document.getElementById("impCpf").value;
    let password = document.getElementById("impPassword").value;
    
    cpf = cpf.replace(".","").replace("-","").replace(".","");
    
    let req = {
      cpf: cpf, 
      password: password
    }
 
    console.log(req)
    api.post("/auth/singin", req)
    .then(response=>{
      localStorage.setItem('SBTK', response.data.token);
      window.location.href = "/mapManeger"
    })
    .catch(()=>{
      // Show the alert
      $('#errorResponse').removeClass('d-none').addClass('show');
    })


});


$(document).ready(function(){
    $("#impCpf").mask("999.999.999-99");
});

$( "#errorResponseClose" ).click(function() {
  $('#errorResponse').removeClass('show').addClass("d-none");
})

