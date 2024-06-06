const axios = require('axios').default;
const BASE_URL = "http://localhost:3000/api/v1";

describe('GET /categorias', () => {
    it('Se reciben las categorias', async () => {
      const res = await axios.get(BASE_URL + '/categorias');
      expect(res.status).toEqual(200);
    });
});

describe('GET /categorias/:category/recetas', () => {
    it('Hay recetas en la categoría', async () => {
      const categoria = "Dessert";
      const res = await axios.get(BASE_URL + '/categorias/' + categoria + '/recetas');
      expect(res.status).toEqual(200);
    });
});

describe('GET /categorias/:category/recetas/:id', () => {
    it('El ID de la receta es válido', async () => {
      const categoria = "Dessert";
      const id = 47;
      const res = await axios.get(BASE_URL + '/categorias/' + categoria + '/recetas/' + id);
      expect(res.status).toEqual(200);
    });
});