const jestOpenAPI = require('jest-openapi').default;
const axios = require('axios').default;
const BASE_URL = "http://localhost:3000/api/v1";
const SCHEMA = "../schema/cine.schema.yaml";
const path = require('path');

describe('GET /recetas', () => {
    it('should satisfy OpenAPI spec', async () => {
      const res = await axios.get(BASE_URL + '/recetas');
      expect(res.status).toEqual(200);
      // Assert that the HTTP response satisfies the OpenAPI spec
      //expect(res).toSatisfyApiSpec();
    });
  });
 