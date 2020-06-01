const tk = localStorage.getItem('SBTK');

const config = {
    headers: { Authorization: `Bearer ${tk}` }
};

function redirecionar(){
    alert("Usuario não valido");
    window.location.href = "/sigabem/login";
}

if(!tk){
    redirecionar();
}else{
    apiSigabem.get("/auth/me", config).then(resp =>{
        if(resp.data.role != "ADMIN"){
            redirecionar();
        }
    }).catch(resp => {
        redirecionar();
    });
}
