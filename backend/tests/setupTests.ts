import { supabaseAdapter } from "../src/config/supabaseClient";

jest.mock("../src/config/supabaseClient", () => ({
  supabaseAdapter: {
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    rpc: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});
