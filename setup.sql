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
