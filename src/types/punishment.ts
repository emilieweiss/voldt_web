export interface Punishment {
  id?: number; // int8 in Supabase = number in TypeScript
  user_id: string; // UUID = string
  amount: number; // int8 = number
  reason: string; // text = string
  created_at?: string; // timestamp = string (ISO format)
}