$( "#btnLogin" ).click(function() {


    // let cpf = document.getElementById("impCpf").value;
    // let date = document.getElementById("impDate").value;
    
    // date = date.split("-");
    // date = date[2] + "/" +date[1]+"/"+date[0];
    // cpf = cpf.split(".");
    // cpf = cpf[0]+cpf[1]+cpf[2]+"";
    // cpf = cpf.split("-");
    // cpf = cpf[0] + cpf[1] + "";
    
    // let req = {
    //   cpf: cpf, 
    //   dt: date
    // }
 
    // axios.post("http://Sigabem-env-1.f2p2pcstzh.us-east-2.elasticbeanstalk.com/users/login", req)
    // .then(response=>{
    //   alert("Login realizado, token: " + response.data.token);
    // })
    // .catch(()=>{
    //   // Show the alert
    //   $('#errorResponse').removeClass('d-none').addClass('show');
    // })

    window.location.href = "../mapManeger.html"

});


$(document).ready(function(){
    $("#impCpf").mask("999.999.999-99");
});

$( "#errorResponseClose" ).click(function() {
  $('#errorResponse').removeClass('show').addClass("d-none");
})

