var app = new Vue({
  el: "#app",

  data: {
    api: apiSigabem,

    users: [],

    errors: [],

    config: {
      headers: { Authorization: `Bearer ${localStorage.getItem("SBTK")}` },
    },

    dataNewUser: {
      cpf: "",
      nome: "",
      data_nascimento: "",
      vem: "",
      tipo_deficiencia: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      telefone: "",
      user_notification_id: "undefined",
      genero: "",
      endereco: {
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "",
        latitude: "",
        longitude: "",
      },
    },
  },

  methods: {
    async getEndereco() {
      try {
        const resp = await axios.get(
          `https://viacep.com.br/ws/${this.dataNewUser.endereco.cep}/json/`
        );
        this.dataNewUser.endereco.logradouro = resp.data.logradouro;
        this.dataNewUser.endereco.estado = resp.data.uf;
        this.dataNewUser.endereco.complemento = resp.data.complemento;
        this.dataNewUser.endereco.bairro = resp.data.bairro;
        this.dataNewUser.endereco.cidade = resp.data.localidade;
        this.dataNewUser.endereco.pais = "Brasil";
      } catch {
        return;
      }
    },
    async addUser() {
      const { estado, cidade, bairro, logradouro } = this.dataNewUser.endereco;
      const query = estado + " " + cidade + " " + bairro + " " + logradouro;
      const resp = await axios.get(
        `https://nominatim.openstreetmap.org/?addressdetails=1&q=${query}&format=json&limit=1`
      );
      if (resp.data.length <= 0) {
        this.errors = [];
        this.errors.push("Preencha todos os dados");
        return;
      }
      this.dataNewUser.endereco.latitude = resp.data[0].lat;
      this.dataNewUser.endereco.longitude = resp.data[0].lon;
      this.dataNewUser.user_notification_id = Math.random();

      this.api
        .post("/users", this.dataNewUser, this.config)
        .then((resp) => {
          $("#exampleModal").modal("hide");
        })

        .catch((error) => {
          this.errors = [];
          if (Array.isArray(error.response.data.message)) {
            const erros = error.response.data.message[0].constraints;
            for (var prop in erros) {
              this.errors.push(erros[prop]);
            }
          } else {
            this.errors.push(error.response.data.message);
          }
        });
    },

    async deleteUser(cpf, data) {
      const returnCheck = await this.api.post("/users/check", {
        cpf: cpf,
        data_nascimento: data,
      });
      const id = returnCheck.data.user.id;
      try {
        const returnDelete = await this.api.delete(`/users/${id}`, this.config);
        alert("Usuario removido com sucesso");
        this.getUsers();
      } catch (err) {
        alert("Usuario não pôde ser removido");
      }

      //const returnDelete = await this.api.post("/users/check");
    },

    getUsers() {
      this.api
        .post("users/find", { role: "ADMIN" }, this.config)
        .then((resp) => {
          this.users = resp.data.found.users;
        })
        .catch((resp) => {});
    },
  },

  mounted() {
    this.getUsers();
  },
});
