import geopandas as gpd
from sqlalchemy import create_engine
import os

# Configurar a opção SHAPE_RESTORE_SHX para YES
os.environ['SHAPE_RESTORE_SHX'] = 'YES'

# Ler o arquivo Shapefile com a codificação 'UTF-8'
gdf = gpd.read_file('Bairros_RMR_Sirgas2000.shp', encoding='UTF-8')

# Converter a coluna de geometria para WKT
gdf['geometry'] = gdf['geometry'].apply(lambda x: x.wkt)

# Criar um banco de dados SQLite e uma conexão a ele
engine = create_engine('sqlite:///my_database.db')

# Escrever os dados do DataFrame GeoPandas para uma tabela no banco de dados
gdf.to_sql('my_table', engine, if_exists='replace', index=False)