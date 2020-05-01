
const tk = localStorage.getItem('SBTK');

const config = {
    headers: { Authorization: `Bearer ${tk}` }
};

function redirecionar(){
    alert("Usuario não valido");
    window.location.href = "../Login-out/SigaBemLogin.html"
}

if(!tk){
    redirecionar()
}else{
    axios.get("http://200.133.17.12:3000/auth/me",
    config)
    .then(resp =>{
        if(resp.data.role != "ADMIN"){
            redirecionar()
        }
    })
    .catch(resp => {
        redirecionar()
    })
}