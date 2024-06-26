const axios = require('axios').default;
const BASE_URL = "http://localhost:3000/api/v1";
const RECETA = {
  "Name" : "Tortilla de patatas",
  "user_id": 1567,
  "user" : "elly9812",
  "Time" : "30M", 
  "Category" : "European",
  "Ingredients" : "Patatas, huevos, aceite, sal",
  "Rating": 5,
  "Instructions": "Pela las patatas y córtalas en rodajas. Fríe las patatas en aceite. Después saca las patatas de la sarten y mézclalas con los huevos. Fríe todo junto."
};


describe('GET /recetas', () => {
  it('Se reciben las recetas', async () => {
    const res = await axios.get(BASE_URL + '/recetas');
    expect(res.status).toEqual(200);
  });
});
/*
describe('GET /recetas/:id', () => {
  it('El ID es válido y la receta existe', async () => {
    const id = 42;
    const res = await axios.get(BASE_URL + '/recetas/' + id);
    expect(res.status).toEqual(200);
    expect(res.data).toEqual(expect.objectContaining({_id: id}));
  });
});*/

describe('GET /recetas/:id/reviews', () => {
  it('Se reciben las reseñas de la receta', async () => {
    const id = 39;
    const res = await axios.get(BASE_URL + '/recetas/' + id + '/reviews');
    expect(res.status).toEqual(200);
  });
});


describe('POST /recetas', () => {
  it('Debe crear una receta', async () => {
    const res = await axios.post(BASE_URL + '/recetas', RECETA);
    expect(res.status).toEqual(201);
  });
});

/*
describe('PUT /recetas/:id', () => {
  it('Debe actualizar una receta', async () => {
    const id = 3965;
    const nuevoNombre = "Basic Cocktail Sauce modificado";
    const datosModificados = {
      Name: nuevoNombre
    };
    const res = await axios.put(BASE_URL + '/recetas/' + id, datosModificados);
    expect(res.status).toEqual(200);
  });  
});*/

/*
describe('DELETE /recetas/:id', () => {
  it('Debe eliminar una receta', async () => {
    const id = 39;
    const res = await axios.delete(BASE_URL + '/recetas/' + id);
    expect(res.status).toEqual(200);
  });
});*/
/*
describe('POST /recetas/:id/reviews', () => {
  it('Debe crear una nueva reseña', async () => {
    // Preparar datos para la nueva reseña
    const reviewData = {
      "user_id": 1567,
      "user": "elly9812",
      "rating": 5,
      "comment": "Me encanta esta receta"
    };
    
    // ID de la receta a la que se le está haciendo la reseña
    const recetaId = 42;

    // Enviar la solicitud para crear la nueva reseña
    const res = await axios.post(BASE_URL + `/recetas/${recetaId}/reviews`, reviewData);

    // Verificar que la respuesta tenga el estado 201 (creado exitosamente)
    expect(res.status).toEqual(201);
  });
});*/