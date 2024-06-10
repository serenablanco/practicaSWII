# PRÁCTICA SISTEMAS WEB II

## MIEMBROS DEL EQUIPO
Serena Blanco García

## TEMÁTICA
Recetas de cocina
API para compartir una gran variedad de recetas de comida.

## REQUISITOS
 - Node.js
 - MongoDB
 - Spoonacular

## PREPARACIÓN DEL ENTORNO
### 1. Clonar este repositorio
 - git clone https://github.com/serenablanco/practicaSWII.git

### 2. Instalar todas las dependencias
 - npm install

### 3. Cargar los datos a una base de datos MongoDB
 - cd /setup
 - ./setup.sh

## RUTAS 
### RECETAS
 - GET /api/v1/recetas
 - GET /api/v1/recetas/{:id}
 - GET /api/v1/recetas/{:id}/reviews
 - GET /api/v1/recetas/{:id}/ingredientes (info API externa)
 - POST /api/v1/recetas
 - PUT /api/v1/recetas/{:id}
 - DELETE /api/v1/recetas/{:id}

### CATEGORÍAS
 - GET /api/v1/categorias
 - GET /api/v1/categorias/{:id}/recetas
 - GET /api/v1/categorias/{:id}/recetas/reviews

### USUARIOS
 - GET /api/v1/usuarios
 - GET /api/v1/usuarios/{:id}/recetas
 - GET /api/v1/usuarios/{:id}/recetas/reviews

