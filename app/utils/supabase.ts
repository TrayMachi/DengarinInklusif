import { createClient } from "./supabase.server";

export const supabase = (request: Request) => createClient(request);
