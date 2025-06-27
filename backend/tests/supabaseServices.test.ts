import { jest } from "@jest/globals";
import { supabaseAdapter } from "../src/config/supabaseClient";

jest.mock("../src/config/supabaseClient", () => ({
  supabaseAdapter: {
    from: jest.fn().mockImplementation(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    rpc: jest.fn(),
  },
}));

describe("SupabaseAdapter Services", () => {
  it("debe recuperar datos de Supabase", async () => {
    const mockData = [{ id: 1, name: "Test Product" }];
    supabaseAdapter
      .from("products")
      .select.mockResolvedValue({ data: mockData, error: null });

    const result = await supabaseAdapter.from("products").select("*");
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("debe manejar errores al recuperar datos", async () => {
    const mockError = { message: "Error fetching data" };
    supabaseAdapter
      .from("products")
      .select.mockResolvedValue({ data: null, error: mockError });

    const result = await supabaseAdapter.from("products").select("*");
    expect(result.data).toBeNull();
    expect(result.error).toEqual(mockError);
  });

  it("debe insertar datos en Supabase", async () => {
    const mockData = { id: 1, name: "New Product" };
    supabaseAdapter
      .from("products")
      .insert.mockResolvedValue({ data: mockData, error: null });

    const result = await supabaseAdapter.from("products").insert(mockData);
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("debe manejar errores al insertar datos", async () => {
    const mockError = { message: "Error inserting data" };
    supabaseAdapter
      .from("products")
      .insert.mockResolvedValue({ data: null, error: mockError });

    const result = await supabaseAdapter
      .from("products")
      .insert({ name: "Invalid Product" });
    expect(result.data).toBeNull();
    expect(result.error).toEqual(mockError);
  });
});
