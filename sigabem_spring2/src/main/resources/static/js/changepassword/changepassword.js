const setPassword = async () => {
    let params = new URLSearchParams(document.location.search.substring(1));

    const data = {
        password: document.getElementById("impPassword").value,
        passwordConfirmation: document.getElementById("impConfirmPassword").value
    }

    let token = params.get("token");
    if(data.password !== data.passwordConfirmation){
       return alert("A senha e a confirmação não conferem")
    }

    if(data.password.length < 6){
        return alert("A senha deve ter no mínimo 6 caracteres")
    }

    const url = "/auth/reset-password/" + token
    try{
        const retorno = await apiSigabem.patch(url, data)
        return alert("Senha alterada com sucesso");
    }catch(err){
        return alert("Token invalido, solicite novamente pelo APP")
    }
}