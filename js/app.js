/**
 * @file app.js
 * @description Controlador iterativo multiciudad.
 */

const form = document.getElementById('search-form');
const input = document.getElementById('city-input');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const rawValue = input.value.trim();
    if (!rawValue) return;

    // Partir por la coma, limpiar espacios vacios, y limitar a 3 búsquedas.
    const cities = rawValue.split(',')
        .map(c => c.trim())
        .filter(c => c !== '')
        .slice(0, 3);
    
    if (cities.length === 0) return;

    clearCards();
    showLoading();

    // Verificación preventiva Offline
    if (!navigator.onLine) {
        showError("Ups! Sin conexión a Internet. Por favor asegúrate de estar conectado.");
        return;
    }

    let failures = 0;
    
    // Almacenaremos todos los errores devueltos por la API (Rate limit, offline, etc.)
    let lastErrorMessage = "";

    // Lanzar peticiones paralelamente maximizando el Performance
    const weatherPromises = cities.map(async (city) => {
        const location = await getCoordinates(city);
        const { current, daily } = await getWeather(location.lat, location.lon);
        const description = translateWeatherCode(current.weathercode);
        return { location, current, daily, description, city };
    });

    // Esperar a que TODAS las promesas acaben, ya sea éxito o Error
    const results = await Promise.allSettled(weatherPromises);

    hideLoading();

    results.forEach(result => {
        if (result.status === 'fulfilled') {
            const data = result.value;
            // Dibujar la tarjeta mandando también el pronóstico diario (.daily)
            renderWeatherCard(data.location, data.current, data.daily, data.description);
        } else {
            failures++;
            // Conservamos explícitamente el texto del error dictado por api.js
            lastErrorMessage = result.reason.message;
            console.error("API Fallada ->", result.reason); 
        }
    });

    // Validar si mostrar algún error consolidado a la UI
    if (failures === cities.length && lastErrorMessage) {
        // En caso de que todo falle, mostramos la razón exacta del DataFetcher
        showError(lastErrorMessage);
    } else if (failures === cities.length) {
        showError("Imposible procesar. Ninguna ciudad pudo cargarse y obtuvimos un fallo desconocido.");
    } else if (failures > 0) {
        showError(`Atención: Fallamos al procesar ${failures} de tus ciudades. (${lastErrorMessage})`);
    }
});
