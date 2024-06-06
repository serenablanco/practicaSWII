const axios = require('axios').default;
const BASE_URL = "http://localhost:3000/api/v1";

describe('GET /usuarios', () => {
    it('Se reciben los usuarios', async () => {
      const res = await axios.get(BASE_URL + '/usuarios');
      expect(res.status).toEqual(200);
    });
});

describe('GET /usuarios/:id/recetas', () => {
    it('Hay recetas creadas por el usuario', async () => {
      const id = 1530;
      const res = await axios.get(BASE_URL + '/usuarios/' + id + '/recetas');
      expect(res.status).toEqual(200);
    });
});

describe('GET /usuarios/:id/recetas/:id', () => {
    it('El ID de la receta es válido', async () => {
      const id_usuario = 1530;
      const id_receta = 113;
      const res = await axios.get(BASE_URL + '/usuarios/' + id_usuario + '/recetas/' + id_receta);
      expect(res.status).toEqual(200);
    });
});
/*
describe('DELETE /usuarios/:id', () => {
    it('Debe eliminar un usuario', async () => {
      const id = 1234567;
      const res = await axios.delete(BASE_URL + '/usuarios/' + id);
      expect(res.status).toEqual(200);
    });
});*/
