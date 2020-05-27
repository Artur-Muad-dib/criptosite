    const express = require('express');
    const { Client } = require('pg');
    const format = require('pg-format');
    const bodyParser = require('body-parser');
	const cors = require('cors');
	const axios = require('axios')
  
    const app = express();
    
    
    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    );
        
    app.use(bodyParser.json());
	
	
	const corsOptions = {
	  origin: "*",
	  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	  preflightContinue: false,
	  optionsSuccessStatus: 204
	}
	
	app.use(cors(corsOptions));
    
    app.set('port', process.env.PORT || 3001);



        
        
     const connectionString = 'postgres://postgres:postgres@localhost:5432/dbsigabem';
     const client = new Client({
         connectionString: connectionString
     });
     client.connect();


    app.get('/bairros', (req, resp) => {

        const query = 'SELECT n_bairro_a as bairro,  st_asGeojson(shape) as geometry FROM postgres.bairros_rmr'
        client
            .query(query)
            .then(res => {resp.send(res.rows)})
            .catch(e => console.error(e.stack))
    });
	
	
	app.get('/municipios', (req, resp) => {

        const query = 'SELECT nm_municip as nome, "população", dens_demo, ST_AsGeojson(shape) as geometry FROM postgres.pe_municipios';
        client
            .query(query)
            .then(res => {resp.send(res.rows)})
            .catch(e => console.error(e.stack))
    });
	
	
	app.get('/calcadas', (req, resp)=>{
        axios.get("http://dados.recife.pe.gov.br/api/3/action/datastore_search?resource_id=272f3273-1443-4243-9964-bf7748646abe")
        .then(response => resp.send(response.data))
    } )

    app.get('/estimativas', (req, resp)=>{
        const {stop} = req.query
        axios.get(`http://200.238.105.143:85/public/recife/stop/${stop}/estimations`)
        .then(response => resp.send(response.data))
    } )


    app.get('/linhas', (req, resp)=>{
        axios.get("http://200.238.105.143:85/public/recife/lines")
        .then(response => resp.send(response.data))
    })


    

    app.get('/stops', (req, resp) =>{
        const {lat, lon} = req.query
        console.log(lat, lon);
        buscarPontos(lat, lon).then(retorno => resp.send(retorno))
    })

    app.post('/pcd', (req, resp) =>{
        const {minAge, maxAge, district, gender, deficit} = req.body;
        

		console.log("chegou");
		
        function valArr(value){
            return Array.isArray(value) && Boolean(value.length)
        }

        if(Number.isInteger(Number(minAge)) && Number.isInteger(Number(maxAge)) && 
            valArr(district) && valArr(gender)  && valArr(deficit) ){

            let query = format(`SELECT n_bairro_a as bairro, municipio, place, nome, sexo, extract(YEAR FROM CURRENT_DATE) - extract(YEAR FROM nascimento) as idade, deficiencia, cpf, ST_AsGeojson(geom) as geometry
                        FROM postgres.pcds_bairro
                        where 	extract(YEAR FROM CURRENT_DATE) - extract(YEAR FROM nascimento) >= %L  and
                                extract(YEAR FROM CURRENT_DATE) - extract(YEAR FROM nascimento) <= %L  and
                                deficiencia in (%L) and
                                sexo in (%L) and
                                n_bairro_a in (%L)`, minAge, maxAge, deficit, gender, district);
                
            client
                .query(query)
                .then(res => {
					console.log(res.rows)
                    resp.status(200).send(res.rows)
            
                })
                .catch(e => {
                    resp.status(400).send(e.stack)
                    console.error(e.stack)
                })

            console.log(query);
 
                
        }else{
                resp.status(400).send(req.body);

        }
    })


    app.listen(3001, function () {
        console.log('Server is running.. on Port 3001');
    });

	
	
	async function buscarPontos(lat, lon){
        let pontos = await axios.get(`http://200.238.105.143:85/public/recife/stops?lat=${lat}&lon=${lon}&meters=350`);
        const stopsLines=  await Promise.all(pontos.data.map(function(result) {
            return axios.get(`http://200.238.105.143:85/public/recife/stop/${result}/lines`)
                        .then(function (response) {
                            return {text: result, line: response.data[0]};
                        }); 
                    }));
        const localizedLines = await Promise.all(stopsLines.map(function(result) {
                return axios.get(`http://200.238.105.143:85/public/recife/line/${result.line}`) 
                            .then(function (response) {
                                if(response.data.stops){
                                    dataStop = response.data.stops.find(el => el.label == result.text)
                                    return {text: result.text, loc: dataStop.location};
                                }
                            });
        }))
        return localizedLines.filter(line => line != null)
    }


