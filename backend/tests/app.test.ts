import request from "supertest";
import app from "../src/index";

jest.setTimeout(30000); // Aumenta el tiempo de espera para evitar problemas de timeout

describe("GET /", () => {
  it("debe responder con mensaje de bienvenida", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Bienvenido a Ochio Club API");
  });
});

describe("POST /api/users", () => {
  let token: string;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@ochio.club", password: "123456", role: "admin" });
    expect(loginRes.statusCode).toBe(200);
    token = loginRes.body.token;
  });

  it("debe crear un usuario y responder con el usuario creado", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "test@ochio.club", password: "123456" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "test@ochio.club");
    expect(res.body).toHaveProperty("role", "artesano");
  });

  it("debe devolver un error si falta el token de autorización", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "test@ochio.club", password: "123456" });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "No autorizado");
  });

  it("debe devolver un error si los datos del usuario son inválidos", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "invalid-email", password: "" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Datos inválidos");
  });
});

export {};
