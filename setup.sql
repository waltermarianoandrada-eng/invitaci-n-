-- 1. Crear la tabla de videos
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS (Seguridad) para permitir que cualquiera lea y escriba
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Permitir insercion publica" ON videos
  FOR INSERT WITH CHECK (true);

-- 3. Crear el "Storage" (Bucket) para guardar los archivos de video reales
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- 4. Políticas de Storage (Cualquiera puede subir y leer videos)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'videos' );

CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'videos' );

-- 5. Crear la tabla de configuración global
CREATE TABLE app_config (
  id INT PRIMARY KEY DEFAULT 1, -- Solo habrá una fila con id=1
  config JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Habilitar RLS para app_config
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de config" ON app_config
  FOR SELECT USING (true);

-- Nota: Para simplificar, permitimos escritura a cualquiera que sepa actualizar el id 1.
-- En un entorno de producción, esto debería estar protegido por auth real.
CREATE POLICY "Permitir actualizacion de config" ON app_config
  FOR UPDATE USING (true) WITH CHECK (true);
  
CREATE POLICY "Permitir insercion inicial de config" ON app_config
  FOR INSERT WITH CHECK (true);
