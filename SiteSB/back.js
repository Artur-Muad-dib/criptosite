/*const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());

let db = new sqlite3.Database('./PCD.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

app.get('/dados', (req, res) => {
    let params = [];
    let sql = 'SELECT * FROM PCD';

    if (req.query.sexo) {
        sql += ' WHERE sexo = ?';
        params.push(req.query.sexo);
    }

    if (req.query.tipo_defic) {
        sql += (params.length ? ' AND' : ' WHERE') + ' tipo_defic = ?';
        params.push(req.query.tipo_defic);
    }

    // Adicione mais condições conforme necessário...

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});*/