const api = axios.create({
    baseURL: "" //base da url openSignal
})


function submeter(ev){

    ev.preventDefault()
    let titulo= document.getElementById("impTitle").value;
    let msg = document.getElementById("impMsg").value;

    let sub ={
        titulo: titulo,
        msg: msg
    }


    // api.post("/...", {

    // })
    
}



document.getElementById('formNotificacao').addEventListener(
    'submit', submeter, false
);