from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import sqlite3

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite solicitações de todas as origens
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos
    allow_headers=["*"],  # Permite todos os cabeçalhos
)


@app.get("/dados")
def read_data(
    sexo: Optional[str] = None,
    tipo_defic: Optional[str] = None,
    idade_min: Optional[int] = None,
    idade_max: Optional[int] = None,
):
    conn = sqlite3.connect("PCD.db")
    c = conn.cursor()

    params = []
    sql = "SELECT * FROM PCD"

    if sexo:
        sql += " WHERE sexo = ?"
        params.append(sexo)

    if tipo_defic:
        sql += (params and " AND" or " WHERE") + " tipo_defic = ?"
        params.append(tipo_defic)

    if idade_min is not None:
        sql += (params and " AND" or " WHERE") + " idade >= ?"
        params.append(idade_min)

    if idade_max is not None:
        sql += (params and " AND" or " WHERE") + " idade <= ?"
        params.append(idade_max)

    c.execute(sql, params)
    rows = c.fetchall()

    return {"data": rows}
