const request = require('supertest');
const app = require('../src/app');

// Example test for stock management

describe('Stock Management API', () => {
  let token;

  beforeAll(async () => {
    // Obtain a valid token for authentication
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@ochio.club', password: '123456' });

    token = response.body.token;
  });

  it('should retrieve stock data successfully', async () => {
    const response = await request(app)
      .get('/api/stock')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('stocks');
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/api/stock');

    expect(response.status).toBe(401);
  });
});
