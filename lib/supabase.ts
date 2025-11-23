import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export type ShiftsData = {
  shift_number: number
  exit_number: number
  exit_name: string
}

export type ExitPosition = {
  image_number: number
  exit_number: number
  position_x: number
  position_y: number
}

export type EmergencyImage = {
  image_number: number
  image_data: string
}
