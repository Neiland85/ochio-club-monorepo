const request = require("supertest");
const app = require("../src/app");

jest.setTimeout(30000); // Aumenta el tiempo de espera para evitar problemas de timeout

let token;

beforeAll(async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@ochio.club", password: "123456" });

  token = response.body.token;
});

describe("Stock Management API", () => {
  it("debe recuperar datos de stock correctamente", async () => {
    const response = await request(app)
      .get("/api/stock")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("stocks");
  });

  it("debe devolver 401 para acceso no autorizado", async () => {
    const response = await request(app).get("/api/stock");

    expect(response.status).toBe(401);
  });
});
