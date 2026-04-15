/**
 * Obtiene las coordenadas geográficas (latitud, longitud) de una ciudad.
 * Se comunica con la API de Geocoding proporcionada de forma gratuita por Open-Meteo.
 * @param {string} city - El nombre de la ciudad buscada por el usuario.
 * @returns {Promise<Object>} Un objeto con las propiedades latitud, longitud, nombre y país.
 * @throws {Error} Si la red falla o la ciudad no arroja ningún resultado coincidente.
 */
async function getCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`;
    
    try {
        const response = await fetch(url);
        
        // Manejo estricto de códigos HTTP
        if (!response.ok) {
            if (response.status === 429) throw new Error("Límite de peticiones excedido (Código 429).");
            if (response.status >= 500) throw new Error("El sistema de geolocalización está caído (Error de Servidor).");
            throw new Error(`Error inesperado del servidor (Código HTTP: ${response.status}).`);
        }
        
        const data = await response.json();
        
        // Manejo de Data Vacía o Incorrecta
        if (!data.results || data.results.length === 0) {
            throw new Error(`La ciudad "${city}" no existe o está mal escrita.`);
        }
        
        return {
            name: data.results[0].name,
            country: data.results[0].country,
            lat: data.results[0].latitude,
            lon: data.results[0].longitude
        };
    } catch (error) {
        // Manejo nativo de caídas completas de Red (DNS fallido, Sin Internet transitorio)
        if (error.name === 'TypeError') {
            throw new Error(`Error de red al intentar buscar "${city}". Verifica tu conexión.`);
        }
        // Repropagar el error controlado si fue creado por nosotros arriba
        throw error;
    }
}

/**
 * Obtiene los datos meteorológicos actuales y pronóstico de 7 días basados en unas coordenadas dadas.
 * @param {number} lat - La latitud de la ubicación obtenida previamente.
 * @param {number} lon - La longitud de la ubicación obtenida previamente.
 * @returns {Promise<Object>} Promesa con objeto conteniendo { current, daily }
 */
async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    try {
        const response = await fetch(url);
        
        // Manejo estricto de códigos HTTP
        if (!response.ok) {
            if (response.status === 429) throw new Error("Has hecho demasiadas consultas climáticas rápidamente.");
            if (response.status >= 500) throw new Error("La API Global de Open-Meteo se encuentra fallando.");
            throw new Error(`Error al descargar el clima (Código HTTP: ${response.status}).`);
        }
        
        const data = await response.json();
        
        // Verificación de integridad estructural
        if (!data.current_weather || !data.daily) {
             throw new Error("Recibimos datos del clima corruptos e incompletos.");
        }
        
        return {
            current: data.current_weather,
            daily: data.daily
        };
    } catch (error) {
        if (error.name === 'TypeError') {
             throw new Error("Caída de conexión intermitente durante la obtención del clima.");
        }
        throw error;
    }
}

/**
 * Convierte el código numérico de clima a una descripción legible en español.
 */
function translateWeatherCode(code) {
    const weatherCodes = {
        0: 'Cielo despejado',
        1: 'Mayormente despejado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Niebla',
        48: 'Niebla con escarcha',
        51: 'Llovizna ligera',
        53: 'Llovizna moderada',
        55: 'Llovizna densa',
        61: 'Lluvia leve',
        63: 'Lluvia moderada',
        65: 'Lluvia fuerte',
        71: 'Nieve leve',
        73: 'Nieve moderada',
        75: 'Nieve fuerte',
        95: 'Tormenta eléctrica',
        96: 'Tormenta con granizo leve',
        99: 'Tormenta con granizo fuerte'
    };
    return weatherCodes[code] || 'Clima desconocido';
}

/**
 * Convierte un código numérico a un Emoji gráfico que represente ese clima.
 * @param {number} code - Código WMO 
 * @returns {string} Emoji
 */
function getWeatherEmoji(code) {
    const emojis = {
        0: '☀️',
        1: '🌤️',
        2: '⛅',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌧️',
        53: '🌧️',
        55: '🌧️',
        61: '🌦️',
        63: '🌧️',
        65: '⛈️',
        71: '❄️',
        73: '❄️',
        75: '❄️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️'
    };
    return emojis[code] || '❓';
}
