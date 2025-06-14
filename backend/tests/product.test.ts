import request from 'supertest';
import app from '../src/index';

describe('GET /api/products', () => {
  it('debe devolver un array de productos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });
});

describe('GET /api/products/:id', () => {
  it('debe devolver un producto existente', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', '1');
  });
  it('debe devolver 404 si el producto no existe', async () => {
    const res = await request(app).get('/api/products/999');
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
    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', newProduct.name);
  });
  it('debe devolver 400 si los datos son inválidos', async () => {
    const res = await request(app).post('/api/products').send({});
    expect(res.statusCode).toBe(400);
  });
});
