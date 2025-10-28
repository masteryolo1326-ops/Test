# Test

## Configuración de Supabase

1. Ve a tu proyecto de Supabase y copia la URL del proyecto y la clave `anon` (el archivo ya incluye las credenciales del proyecto `slcewcigqiauczwknedt`).
2. Abre `index.html` y busca la sección de `<meta name="supabase-url">`.
3. Si actualizas la `anon key`, la aplicación detectará automáticamente el `ref` del proyecto y ajustará la URL si hay un desajuste. Aun así, puedes definir explícitamente las variables globales `window.SUPABASE_URL` y `window.SUPABASE_ANON_KEY` antes de cargar el script para forzar valores concretos.
4. Asegúrate de que la tabla `votes` exista (el archivo contiene el SQL de referencia al final).

Con esto, el frontend podrá autenticar usuarios y registrar votos en tiempo real.
