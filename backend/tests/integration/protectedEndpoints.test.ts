import request from "supertest";
import app from "../../src/app";
import jwt from "jsonwebtoken";

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

if (!SUPABASE_JWT_SECRET) {
  throw new Error(
    "SUPABASE_JWT_SECRET no está definido en las variables de entorno",
  );
}

describe("Protected Endpoints", () => {
  let validToken: string;
  let invalidToken: string;

  beforeAll(() => {
    validToken = jwt.sign(
      { id: "user-1", role: "admin" },
      SUPABASE_JWT_SECRET,
      { expiresIn: "1h" },
    );
    invalidToken = jwt.sign({ id: "user-2", role: "user" }, "wrong-secret", {
      expiresIn: "1h",
    });
  });

  it("should return 200 for valid token and admin role", async () => {
    const response = await request(app)
      .get("/api/protected-route")
      .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Access granted");
  });

  it("should return 403 for valid token but insufficient role", async () => {
    const userToken = jwt.sign(
      { id: "user-3", role: "user" },
      SUPABASE_JWT_SECRET,
      { expiresIn: "1h" },
    );

    const response = await request(app)
      .get("/api/protected-route")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error", "Insufficient permissions");
  });

  it("should return 401 for invalid token", async () => {
    const response = await request(app)
      .get("/api/protected-route")
      .set("Authorization", `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Invalid or expired token");
  });

  it("should return 401 for missing token", async () => {
    const response = await request(app).get("/api/protected-route");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Token not provided");
  });
});
