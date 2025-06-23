import request from 'supertest';
import app from '../src/index';

let authToken: string;

beforeAll(async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@ochio.club', password: '123456' });
  expect(loginRes.statusCode).toBe(200);
  authToken = loginRes.body.token;
});

describe('GET /api/products', () => {
  it('debe devolver un array de productos o vacío', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/products/:id', () => {
  it('debe devolver 404 si el producto no existe', async () => {
    const res = await request(app)
      .get('/api/products/999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /api/products', () => {
  it('debe crear un producto y devolverlo', async () => {
    const newProduct = {
      name: 'Producto Test',
      description: 'Descripción test',
      price: 99.99,
      stock: 10,
    };
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'Producto Test');
  });
});
