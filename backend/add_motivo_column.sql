-- Agregar columna motivo a la tabla citas
ALTER TABLE public.citas
ADD COLUMN IF NOT EXISTS motivo TEXT;

-- Comprobar que la columna existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'citas' 
ORDER BY ordinal_position;
