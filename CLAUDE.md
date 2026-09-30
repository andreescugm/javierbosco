# JAVIER BOSCO — LANDING ULTRA-LUJO OFF-MARKET

## CONTEXTO DE NEGOCIO

Javier Bosco es broker inmobiliario off-market en Madrid. No aparece en portales. No busca clientes, los clientes le buscan a él. Opera en el rango de 1M€ a 200M€: solares estratégicos, edificios completos (como los del Viso), hoteles y cadenas hoteleras, residencial de lujo y activos singulares. También yates y aviación privada bajo cita. Discreción absoluta.

Tagline: "Off-market. On-point."

## PSICOLOGÍA DEL VISITANTE (ULTRA-HIGH-NET-WORTH)

El visitante de esta web gestiona un patrimonio de 8-9 cifras. No le impresionan logos brillantes ni animaciones gratuitas. Lo que busca:

- Señales de exclusividad: si parece accesible para todos, no es para él.
- Escasez implícita: lo valioso no se anuncia, se susurra.
- Control y discreción: nada grita. Todo sugiere.
- Sofisticación silenciosa: el lujo real no necesita explicarse.
- Confianza inmediata: diseño impecable = profesional serio.
- Nada de venta agresiva. Nada de CTAs desesperados. El tono es: "Si estás aquí, ya sabes por qué."

La web NO vende. La web FILTRA. Solo los que entienden este mundo se sienten cómodos aquí. El resto se va. Eso es correcto.

## ESTADO REAL DE LA WEB (fuente de verdad — actualizado 30/09/2026)

La web está en **modo claro** (crema + oro apagado). La versión oscura "obsidiana" se descartó. No reconvertir a oscuro salvo que se pida explícitamente.

### Datos de negocio que se muestran
- Rango de operaciones: **1M€ – 200M€** (único en toda la web: texto de La firma, FAQ y slider del buscador).
- NO publicar cifras de track record (nº de operaciones, años, mayor operación) salvo que el cliente las confirme por escrito.
- Email público: javierbosco@javierbosco.com (Zoho). El formulario envía a **javierboscointerno@gmail.com** vía FormSubmit (constantes en `src/legal.tsx`).

### Paleta (constante `C` en `src/App.tsx`; ojo: "black" = fondo claro, "white" = texto oscuro)
- Fondo crema: #F5F2EB · Fondo secundario: #EAE7E0 · Líneas: #D5D0C8
- Texto: #030303 · Texto secundario: #585249 / #504B44
- Oro: #A08C5B (acentos, cursivas de titulares) · Oro texto sobre claro: #6B5A2E · Oro hover: #BFA36D

### Tipografía (autoalojada con @fontsource, sin Google Fonts)
- Titulares: Playfair Display 400/500 (+ cursiva)
- Texto: Cormorant Garamond 400/500 (+ cursiva) — no usar 300, se lee mal
- UI / etiquetas: Inter 400/500, mayúsculas con tracking amplio

### Animación
- Framer Motion, easing [0.25, 0.1, 0.25, 1], reveals de ~1s, `viewport={{ once: true, amount: 0.15 }}`.
- Scroll suave con Lenis. Para navegar a una sección usar `scrollToId()`; no confiar en anclas nativas.
- El humo WebGL existe SOLO en el hero. No añadirlo a otras secciones.

### Imágenes
- Todas autoalojadas en `public/img/*.webp` (sin hotlinks a Unsplash). Cada foto de destino debe ser de ESA ciudad.
- Destinos, tipologías y extra: fotos de Unsplash (licencia libre). Propiedades: fotos propias.
- `prop-plazamayor.webp` viene de un original de 474px: sustituir por una foto de más resolución en cuanto la haya.

### Estructura
- `src/App.tsx`: todas las secciones (Hero, Activos, Tipologías, Extra yates/aviones, Destinos, La firma, Vender, Contacto, FAQ, Footer, modal legal).
- `src/i18n.ts`: TODO el texto visible en 9 idiomas (es, en, fr, de, it, pt, ru, ar, zh). Nada de texto fijo en los componentes.
- `src/legal.tsx`: aviso legal, privacidad y cookies + datos del titular (`TITULAR`, rellenar NIF/domicilio).
- `src/components/CardStack.tsx`: carrusel de destinos.
- Despliegue: GitHub Pages sirviendo `/docs` (dominio javierbosco.com, `CNAME`). La Action reconstruye `docs/` en cada push a `main`.

## TONO DE COMUNICACIÓN

- Frases cortas. Directas. Sin adornos. Sin exclamaciones ni lenguaje de venta agresivo.
- Tercera persona o impersonal. El visitante es inteligente: no explicar lo obvio.
- La web no vende, filtra.

## REGLAS DE EJECUCIÓN PARA CLAUDE CODE

### Calidad sobre velocidad
- NUNCA entregues la primera versión sin revisarla tú mismo. Antes de mostrar código, pregúntate: "¿Esto parece una web de 50M€ o una plantilla gratuita?" Si la respuesta es plantilla, rehaz.
- Compara mentalmente cada componente con webs como Sotheby's International Realty, Knight Frank, o The Agency. Si no está a ese nivel, no es suficiente.
- Si un componente se ve genérico, no lo entregues. Itéralo internamente hasta que tenga personalidad.

### Eficiencia de tokens
- NO hagas revisiones parciales. Cambia todo lo necesario de una vez por archivo.
- NO expliques lo que vas a hacer. Hazlo directamente.
- NO repitas código que no has cambiado. Usa ediciones quirúrgicas.
- NO pidas confirmación para cada paso. Lee CLAUDE.md, ejecuta, entrega.
- Agrupa cambios relacionados en una sola operación.

### Flujo de trabajo
1. Lee CLAUDE.md completo antes de tocar cualquier archivo.
2. Analiza el estado actual del proyecto (archivos, estructura, dependencias).
3. Ejecuta los cambios necesarios en bloque, no uno a uno.
4. Verifica que no haya inconsistencias visuales entre componentes.
5. Solo entonces muestra el resultado.

### Autoexigencia
- Cada componente debe pasar este test: ¿un cliente con 50M€ en patrimonio se sentiría cómodo aquí? ¿O pensaría que es amateur?
- Si dudas entre dos opciones, elige la más sobria y espaciosa.
- Si algo "funciona pero no impresiona", no funciona.
- Nunca uses valores por defecto de Tailwind sin personalizarlos. Los defaults son genéricos por definición.
- Revisa spacing, font-sizes, colors y animations contra las specs de este documento antes de entregar.

### Verificación obligatoria antes de hacer push
1. `npx tsc -b` y `npm run lint` sin errores.
2. `npm run build` (genera `docs/` con CNAME y .nojekyll).
3. Probar en local (`npm run preview`) escritorio y móvil (390px): menú móvil, formulario, FAQ, modales legales, cambio de idioma.
4. Tras el push, esperar a la Action "Deploy to GitHub Pages" y comprobar https://javierbosco.com (hard refresh) y que el JS de `docs/index.html` coincide con el publicado.
