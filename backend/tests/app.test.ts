import request from 'supertest';
import app from '../src/index';

describe('GET /', () => {
  it('debe responder con mensaje de bienvenida', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});

describe('POST /api/users', () => {
  it('debe crear un usuario y responder con el usuario creado', async () => {
    // Simular login como admin para obtener token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@ochio.club', password: '123456', role: 'admin' });
    expect(loginRes.statusCode).toBe(200);
    const token = loginRes.body.token;
    // Usar el token para crear usuario
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'test@ochio.club', password: '123456' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'test@ochio.club');
    expect(res.body).toHaveProperty('role', 'artesano');
  });
});
