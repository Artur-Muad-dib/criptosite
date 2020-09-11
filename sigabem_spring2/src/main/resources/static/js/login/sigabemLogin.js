$("#btnLogin").click(function () {
  let cpf = document.getElementById("impCpf").value;
  let password = document.getElementById("impPassword").value;

  cpf = cpf.replace(".", "").replace("-", "").replace(".", "");

  let req = {
    cpf: cpf,
    password: password,
  };

  apiSigabem
    .post("/auth/singin", req)
    .then((response) => {
      localStorage.setItem("SBTK", response.data.token);
      window.location.href = "/sigabem/mapManager";
    })
    .catch(() => {
      // Show the alert
      $("#errorResponse").removeClass("d-none").addClass("show");
    });
});

$(document).ready(function () {
  $("#impCpf").mask("999.999.999-99");
});

$("#errorResponseClose").click(function () {
  $("#errorResponse").removeClass("show").addClass("d-none");
});
