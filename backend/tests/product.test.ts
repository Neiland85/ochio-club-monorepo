import request from 'supertest';
import app from '../src/index';

let authToken: string;

beforeAll(async () => {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@ochio.club', password: '123456' });
  expect(loginRes.statusCode).toBe(200);
  authToken = loginRes.body.token;
  console.log('Token obtenido para pruebas:', authToken);
});

describe('GET /api/products', () => {
  it('debe devolver un array de productos', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    console.log('Respuesta de productos:', res.body);
  });
});

describe('GET /api/products/:id', () => {
  it('debe devolver un producto existente', async () => {
    const res = await request(app)
      .get('/api/products/1')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', '1');
  });
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
      stock: 10
    };
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', newProduct.name);
  });
  it('debe devolver 400 si los datos son inválidos', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });
  it('debe crear un nuevo producto', async () => {
    const newProduct = {
      name: 'Producto de prueba',
      price: 100,
      stock: 50
    };
    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', newProduct.name);
    expect(res.body).toHaveProperty('price', newProduct.price);
    expect(res.body).toHaveProperty('stock', newProduct.stock);
  });
  it('debe devolver 400 si los datos son inválidos', async () => {
    const invalidProduct = {
      name: '',
      price: -10,
      stock: -5
    };
    const res = await request(app).post('/api/products').send(invalidProduct);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
