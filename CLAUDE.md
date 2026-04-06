# JAVIER BOSCO — LANDING ULTRA-LUJO OFF-MARKET

## CONTEXTO DE NEGOCIO

Javier Bosco es broker inmobiliario off-market en Madrid. No aparece en portales. No busca clientes, los clientes le buscan a él. Opera en el rango de 7M€ a 120M€: solares estratégicos, edificios completos (como los del Viso), hoteles y cadenas hoteleras. Más de 300 operaciones cerradas en 5+ años. Discreción absoluta.

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

## IDENTIDAD VISUAL

### Paleta de color
- Negro obsidiana (fondo principal): #050505
- Negro profundo (fondos secundarios/cards): #0A0A0A
- Negro elevado (bordes sutiles, separadores): #141414
- Oro real apagado (acentos, highlights): #A08C5B
- Oro hover (interacciones): #BFA36D
- Blanco roto (texto principal): #E8E4DD
- Gris ceniza (texto secundario): #6B6560
- Gris humo (texto terciario/placeholders): #3A3632

REGLA: El oro NUNCA es brillante, NUNCA es #FFD700. Es apagado, mate, como oro envejecido en una caja fuerte suiza. Se usa con extrema moderación — solo en detalles que merecen atención: una línea, un número, un borde activo.

### Tipografía
- Headings: Playfair Display (serif). Weight 400-700. Tracking ligeramente expandido (+0.02em). Tamaños generosos: hero 72-96px, secciones 48-56px.
- Body/Labels: Lora (serif) para párrafos elegantes. Weight 300-400.
- Elementos UI/Micro-copy: Inter o similar sans-serif limpia. Weight 300. Uppercase con tracking amplio (+0.15em) para labels y categorías.
- Line-height generoso siempre: 1.4 para headings, 1.8 para body.

### Espaciado — Proporciones Áureas
- Padding vertical entre secciones: mínimo 160px, ideal 200px.
- Padding horizontal: mínimo 80px en desktop, 24px en mobile.
- Espacio entre elementos dentro de sección: seguir ratio 1:1.618.
- El espacio vacío ES el diseño. Si algo parece lleno, necesita más aire.
- Cada elemento debe respirar. Si dos cosas están cerca, pregúntate si deberían estarlo.

REGLA: El lujo se comunica con lo que NO hay, no con lo que hay. Blackspace es tu herramienta principal.

## DIRECCIÓN ARTÍSTICA — SIN CITY + BOND + OBSIDIANA

### Atmósfera general
La web se siente como entrar en una sala privada a oscuras donde alguien muy poderoso te está esperando. No ves todo de golpe. Las cosas aparecen. Se revelan. Como si la web decidiera mostrarte las cosas solo cuando estás listo.

### Transiciones y animaciones (Framer Motion)
- Filosofía: medio tech, medio fantasma. Las cosas no "entran" — se materializan.
- Velocidad: lenta y deliberada. Duration mínima 0.8s, ideal 1-1.2s para reveals.
- Easing: [0.25, 0.1, 0.25, 1] — movimiento con peso, no rebote.
- Entrada de texto: fade-in + translate-y sutil (20px máximo). Staggered entre líneas (0.15s delay).
- Entrada de bloques: opacity 0→1 con scale muy sutil (0.98→1). Nada de slides agresivos.
- Líneas decorativas: se dibujan (width 0→100%) con delay.
- Números/stats: counter animation suave, no instantánea.
- TODAS las animaciones deben activarse con whileInView, NO solo una vez. Al hacer scroll arriba y abajo, los elementos siempre se animan al reaparecer.
- viewport amount: 0.3 (se activa cuando el 30% del elemento es visible).

REGLA: Si una animación llama la atención sobre sí misma, es demasiado. El visitante debe sentir que algo pasó, no saber exactamente qué.

### Efectos visuales
- Sombras: solo sutiles, difusas, oscuras. box-shadow con negro y spread amplio. Nunca sombras duras o claras.
- Gradientes: solo oscuros, de #050505 a #0A0A0A o a transparente. Para crear profundidad, no decoración.
- Líneas: finas (1px), en #141414 o en oro #A08C5B para emphasis. Horizontales preferentemente.
- Hover states: transiciones lentas (0.5s). Cambios sutiles de opacidad o color. El oro aparece en hover como un susurro.
- Sin bordes redondeados excesivos. Border-radius máximo 2-4px. El lujo tiene ángulos.
- Sin box-shadows coloridos. Sin glows. Sin neon. Sin glassmorphism.

### Imágenes
- Si se usan: en blanco y negro o con desaturación extrema.
- Overlays oscuros pesados (80-90% opacidad) sobre cualquier imagen.
- Las imágenes son textura de fondo, nunca el protagonista.

## SECCIONES DE LA LANDING

### 1. Hero (100vh)
- Fondo negro obsidiana total, quizás con textura arquitectónica apenas perceptible.
- "JAVIER BOSCO" grande, Playfair Display, tracking expandido.
- Debajo: "Off-market. On-point." en oro apagado, más pequeño.
- Subtexto: "Las propiedades que valen de verdad no están en ningún portal." en gris ceniza.
- CTA: "Solicitar Acceso" — borde oro fino, fondo transparente, hover rellena oro sutil.
- Indicador de scroll animado en la parte inferior (línea fina que pulsa).
- Todo aparece staggered: primero el nombre, luego tagline, luego subtexto, luego CTA.

### 2. Sobre Javier / Filosofía
- Texto breve y contundente sobre quién es y por qué opera en off-market.
- Tono: no es una bio, es una declaración. "No trabajo con portales. Trabajo con confianza."
- Estructura limpia: texto a un lado, quizás un dato destacado al otro.
- Sin foto a menos que sea de muy alta calidad y tratada en B&W.

### 3. Track Record / Números
- Grid de 3-4 stats grandes: "+300 Operaciones", "5+ Años", "120M€ Mayor operación", "7-120M€ Rango".
- Números en oro apagado, Playfair Display, gran tamaño.
- Labels en Inter uppercase, gris ceniza, tracking amplio.
- Counter animation al entrar en viewport.
- Separadores finos entre celdas.

### 4. Servicios / Qué hace
- Máximo 3-4 servicios. Compra off-market, venta discrecional, advisory, gestión de activos singulares.
- Sin iconos genéricos. Si hay iconos, que sean líneas finas custom.
- Cada servicio: título + una frase. Nada más. Si necesitas más texto, sobra texto.

### 5. Contacto / Acceso
- Mínimo: email o formulario de una línea. "Nombre. Operación. Rango."
- Nada de formularios largos. Si alguien tiene que rellenar 8 campos, no es el cliente correcto.
- CTA final: "Hablemos" o "Solicitar Acceso". Oro, discreto.
- Quizás un número de teléfono en texto fino.

## STACK TÉCNICO
- React + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion para todas las animaciones
- Google Fonts: Playfair Display, Lora, Inter
- Mobile-first responsive

## REGLAS ABSOLUTAS

1. NUNCA uses colores brillantes, neón, gradientes coloridos o efectos que parezcan startup tech.
2. NUNCA uses border-radius mayores a 4px.
3. NUNCA apelotones contenido. Si dudas, añade más espacio.
4. NUNCA uses lenguaje de venta agresivo. Nada de "¡Descubre!", "¡No te pierdas!", exclamaciones.
5. NUNCA uses stock photos reconocibles o imágenes de baja calidad.
6. NUNCA uses más de 3 niveles de jerarquía tipográfica por sección.
7. SIEMPRE activa animaciones con whileInView, nunca one-time.
8. SIEMPRE usa transiciones lentas (mínimo 0.5s para hovers, 0.8s para reveals).
9. SIEMPRE prioriza el espacio vacío sobre el contenido.
10. SIEMPRE mantén la coherencia visual: misma paleta, mismas fuentes, mismas sombras en TODA la landing.

## TONO DE COMUNICACIÓN

- Frases cortas. Directas. Sin adornos.
- Tercera persona o impersonal. Nunca "¡Contacta conmigo!"
- El visitante es inteligente. No le expliques lo obvio.
- Menos es más. Si puedes decirlo en 5 palabras, no uses 10.
- Inspira confianza con brevedad, no con cantidad.

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
