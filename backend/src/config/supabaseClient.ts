import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Las variables de entorno SUPABASE_URL y SUPABASE_KEY deben estar definidas.",
  );
}

export class SupabaseAdapter {
  private client;

  constructor() {
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  from(table: string) {
    return this.client.from(table);
  }

  rpc(functionName: string, params?: Record<string, any>) {
    return this.client.rpc(functionName, params);
  }
}

export const supabaseAdapter = new SupabaseAdapter();
export const supabaseClient = createClient(supabaseUrl, supabaseKey);
