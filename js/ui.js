/**
 * @file ui.js
 * @description Módulo de visualización (Múltiples Tarjetas y Pronóstico semanal).
 */

const elements = {
    container: document.getElementById('cards-container'),
    status: document.getElementById('status-container'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error-message'),
    errorText: document.querySelector('#error-message p'),
    cityInput: document.getElementById('city-input')
};

function clearCards() {
    elements.container.innerHTML = '';
}

function showLoading() {
    elements.status.classList.remove('hidden');
    elements.loading.classList.remove('hidden');
    elements.error.classList.add('hidden');
}

function hideLoading() {
    elements.loading.classList.add('hidden');
    // Solo escondemos el status completo si no hay ningún mensaje de error visible
    if(elements.error.classList.contains('hidden')) {
        elements.status.classList.add('hidden');
    }
}

function showError(message) {
    elements.status.classList.remove('hidden');
    elements.loading.classList.add('hidden');
    
    elements.errorText.textContent = message;
    elements.error.classList.remove('hidden');
}

function renderWeatherCard(locationData, currentData, dailyData, description) {
    elements.error.classList.add('hidden');
    if(elements.loading.classList.contains('hidden')) {
        elements.status.classList.add('hidden');
    }
    
    const card = document.createElement('div');
    card.className = 'weather-card hidden';
    
    // --- GENERAR HTML DEL PRONÓSTICO (7 DÍAS) ---
    let forecastHTML = '<div class="forecast-container">';
    
    for(let i = 0; i < dailyData.time.length; i++) {
        // Formatear ISO (2026-04-15) forzando zona local correcta agregando tiempo explícito nulo (T12:00 evita desfases transcontinentales).
        const dateStr = dailyData.time[i]; 
        const dateObj = new Date(dateStr + 'T12:00:00'); 
        const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(dateObj);
        
        const emoji = getWeatherEmoji(dailyData.weathercode[i]);
        const tempMax = Math.round(dailyData.temperature_2m_max[i]);
        const tempMin = Math.round(dailyData.temperature_2m_min[i]);
        
        forecastHTML += `
            <div class="forecast-item">
                <span class="day-name">${dayName.substring(0, 3)}</span>
                <span class="day-icon">${emoji}</span>
                <span class="day-temps">
                    <span class="max">${tempMax}°</span>
                    <span class="min">${tempMin}°</span>
                </span>
            </div>
        `;
    }
    forecastHTML += '</div>';
    
    // --- INSERTAR TODO JUNTO ---
    card.innerHTML = `
        <div class="weather-content">
            <div class="weather-header">
                <h1>${locationData.name}, ${locationData.country}</h1>
            </div>
            <div class="weather-body">
                <div class="temperature">
                    <h2>${Math.round(currentData.temperature)}</h2><span class="unit">°C</span>
                </div>
                <p class="weather-description">${description}</p>
                <div class="weather-details">
                    <div class="detail-box">
                        <span class="detail-label">Viento</span>
                        <span class="detail-value">${currentData.windspeed} km/h</span>
                    </div>
                </div>
                
                <!-- Pronóstico Añadido Visualmente Aquí -->
                ${forecastHTML}

            </div>
        </div>
    `;
    
    elements.container.appendChild(card);
    
    requestAnimationFrame(() => {
        card.classList.remove('hidden');
    });
    
    elements.cityInput.value = '';
    elements.cityInput.blur();
}
