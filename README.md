# 🌤️ WeatherApp Premium

Una aplicación web de clima moderna, ligera y responsiva. Permite consultar el estado actual del tiempo y pronóstico de una semana para hasta 3 ciudades simultáneamente, ofreciendo una experiencia interactiva sin dependencias externas.

## ⚙️ Características Técnicas

- **Búsqueda Múltiple Simultánea:** Consultas concurrentes optimizadas (`Promise.allSettled()`) para dibujar hasta 3 tarjetas de clima en la misma pantalla en tiempo récord.
- **Pronóstico Semanal Analítico:** Vista previa a 7 días extraída de arreglos vectoriales (`.daily`) con temperaturas máximas, mínimas, e interpretador visual de Emojis (`getWeatherEmoji`).
- **Detección Práctica de Errores:** Interceptores robustos previniendo faltas de red (`navigator.onLine`), servidores caídos (Errores HTTP 500+) o abusos de petición (Rate Limiting HTTP 429).
- **Zero-Installation Engine:** Ejecución de Vanilla JavaScript (sin módulos nativos bloqueables) posibilitando abrir el portal con el crudo protocolo `file:///` sin incurrir en penalizaciones por CORS.
- **Suite de Pruebas (TDD):** Archivo autónomo `test.html` para auditar la integridad arquitectónica y aserciones de comunicación (Integración E2E y Pruebas Unitarias al WMO Map).

## 🚀 Forma de Uso

No requiere comandos NPM ni terminales para inicializarse:
1. Navega a la ruta local donde extrajiste el WeatherApp.
2. Abre (doble-clic rápido) el archivo `index.html` en Chrome, Safari u otro navegador gráfico.
3. Escribe hasta un límite de 3 ciudades separadas por coma (Ej: `Bogotá, París, Montreal`).

## 🎨 Consideraciones de Diseño

- **Glassmorphism (Cristalismo):** Interfaz inmersiva basada en opacidades y `backdrop-filter: blur()`, propiciando capas translúcidas.
- **Cuadrícula Responsive (Flex-Layout):** Expansión visual que fluye de empaquetado Side-By-Side a agrupaciones en torre dependientes del Viewport (Dispositivos Móviles).
- **Feedback Constante (UX):** Mensajes en pantalla y Tooltips que ayudan al usuario sin interrumpirlo agresivamente.

## ⚖️ Licencia y Atribución (Open Source)

El presente repositorio con su código de UI y scripts lógicos están cedidos bajo los términos abiertos de la **Licencia MIT**.

**Avisos Legales (Créditos Múltiples Externos):**
Este portal interconecta con la infraestructura climatológica externa de la agrupación **Open-Meteo**. Acordando a sus políticas ODbL (Open Database License) sobre la obtención de ubicaciones, notificamos expresamente que la resolución latitudinal base de nuestros buscadores proviene por derecho de contribuyentes al proyecto global [OpenStreetMap](https://www.openstreetmap.org/copyright), e información atmosférica proveniente de [Open-Meteo.com](https://open-meteo.com/).
