-- Schema para la base de datos de Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- Tabla para los nombres de las salidas por turno
CREATE TABLE IF NOT EXISTS shifts_data (
  id BIGSERIAL PRIMARY KEY,
  shift_number INTEGER NOT NULL CHECK (shift_number >= 1 AND shift_number <= 4),
  exit_number INTEGER NOT NULL CHECK (exit_number >= 1 AND exit_number <= 10),
  exit_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(shift_number, exit_number)
);

-- Tabla para las posiciones de los puntos en las imágenes
CREATE TABLE IF NOT EXISTS exit_positions (
  id BIGSERIAL PRIMARY KEY,
  image_number INTEGER NOT NULL CHECK (image_number IN (1, 2)),
  exit_number INTEGER NOT NULL CHECK (exit_number >= 1 AND exit_number <= 10),
  position_x DECIMAL(10, 6) NOT NULL,
  position_y DECIMAL(10, 6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(image_number, exit_number)
);

-- Tabla para las imágenes de emergencia
CREATE TABLE IF NOT EXISTS emergency_images (
  id BIGSERIAL PRIMARY KEY,
  image_number INTEGER NOT NULL UNIQUE CHECK (image_number IN (1, 2)),
  image_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_shifts_data_shift ON shifts_data(shift_number);
CREATE INDEX IF NOT EXISTS idx_exit_positions_image ON exit_positions(image_number);
CREATE INDEX IF NOT EXISTS idx_emergency_images_number ON emergency_images(image_number);

-- Función para actualizar el timestamp de updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_shifts_data_updated_at BEFORE UPDATE ON shifts_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exit_positions_updated_at BEFORE UPDATE ON exit_positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_images_updated_at BEFORE UPDATE ON emergency_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE shifts_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE exit_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_images ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso (permitir lectura y escritura a todos por ahora)
-- LECTURA: Cualquiera puede leer
CREATE POLICY "Permitir lectura a todos" ON shifts_data
  FOR SELECT USING (true);

CREATE POLICY "Permitir lectura a todos" ON exit_positions
  FOR SELECT USING (true);

CREATE POLICY "Permitir lectura a todos" ON emergency_images
  FOR SELECT USING (true);

-- ESCRITURA: Cualquiera puede escribir (puedes restringir esto después si necesitas autenticación)
CREATE POLICY "Permitir inserción a todos" ON shifts_data
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización a todos" ON shifts_data
  FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminación a todos" ON shifts_data
  FOR DELETE USING (true);

CREATE POLICY "Permitir inserción a todos" ON exit_positions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización a todos" ON exit_positions
  FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminación a todos" ON exit_positions
  FOR DELETE USING (true);

CREATE POLICY "Permitir inserción a todos" ON emergency_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización a todos" ON emergency_images
  FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminación a todos" ON emergency_images
  FOR DELETE USING (true);
