#!/bin/bash

# Variables
DB_NAME="libroDeRecetas"
declare -A COLLECTIONS
COLLECTIONS=(
    ["recetas"]="recetas.json"
    ["categorias"]="categorias.json"
    ["usuarios"]="usuarios.json"
    ["reviews"]="reviews.json"
)

# Función para importar un archivo JSON en una colección específica
import_json() {
  local collection=$1
  local file=$2

  # Verificar si el archivo JSON existe
  if [ ! -f "$file" ]; then
    echo "Error: El archivo $file no existe."
    return 1
  fi

  # Importar datos en MongoDB
  mongoimport --db "$DB_NAME" --collection "$collection" --file "$file" --jsonArray

  # Comprobar si la importación fue exitosa
  if [ $? -eq 0 ]; then
    echo "Importación exitosa de $file a la colección $collection!"
  else
    echo "Importación fallida de $file a la colección $collection!"
    return 1
  fi
}

# Iterar sobre las colecciones y sus archivos JSON e importarlos
for collection in "${!COLLECTIONS[@]}"; do
  import_json "$collection" "${COLLECTIONS[$collection]}"
done