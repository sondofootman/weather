document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    let currentCity = 'London';
    
    // Initial load
    fetchWeather(currentCity);
    
    // Update date
    updateDate();
    
    // Search button click
    searchBtn.addEventListener('click', () => {
        if (cityInput.value.trim()) {
            currentCity = cityInput.value.trim();
            fetchWeather(currentCity);
        }
    });
    
    // Refresh button click
    refreshBtn.addEventListener('click', () => {
        fetchWeather(currentCity);
    });
    
    // Enter key in input field
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && cityInput.value.trim()) {
            currentCity = cityInput.value.trim();
            fetchWeather(currentCity);
        }
    });
    
    function fetchWeather(city) {
        loadingIndicator.classList.remove('hidden');
        
        // Using wttr.in API
        fetch(`https://wttr.in/${city}?format=j1`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(data => {
                updateWeatherUI(data);
                loadingIndicator.classList.add('hidden');
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
                alert('Error fetching weather data. Please try another city.');
                loadingIndicator.classList.add('hidden');
            });
    }
    
    function updateWeatherUI(data) {
        const current = data.current_condition[0];
        const area = data.nearest_area[0];
        
        // Update location
        document.getElementById('location').textContent = 
            `${area.areaName[0].value}, ${area.region[0].value}`;
        
        // Update current temp
        document.getElementById('currentTemp').textContent = `${current.temp_C}°C`;
        
        // Update feels like
        document.getElementById('feelsLike').textContent = `${current.FeelsLikeC}°C`;
        
        // Update humidity
        document.getElementById('humidity').textContent = `${current.humidity}%`;
        
        // Update wind speed
        document.getElementById('windSpeed').textContent = `${current.windspeedKmph} km/h`;
        
        // Update visibility
        document.getElementById('visibility').textContent = `${current.visibility} km`;
        
        // Update weather condition
        const condition = current.weatherDesc[0].value;
        document.getElementById('weatherCondition').textContent = condition;
        
        // Update weather icon based on condition
        updateWeatherIcon(condition, current.isday === 'yes');
    }
    
    function updateWeatherIcon(condition, isDay) {
        const iconElement = document.getElementById('weatherIcon');
        let iconClass = '';
        
        condition = condition.toLowerCase();
        
        if (condition.includes('sunny') || condition.includes('clear')) {
            iconClass = isDay ? 'fas fa-sun' : 'fas fa-moon';
        } else if (condition.includes('cloud')) {
            iconClass = isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon';
        } else if (condition.includes('rain')) {
            iconClass = 'fas fa-cloud-rain';
        } else if (condition.includes('storm')) {
            iconClass = 'fas fa-bolt';
        } else if (condition.includes('snow')) {
            iconClass = 'fas fa-snowflake';
        } else if (condition.includes('fog') || condition.includes('mist')) {
            iconClass = 'fas fa-smog';
        } else {
            iconClass = 'fas fa-cloud';
        }
        
        // Set color based on time
        const iconColor = isDay ? 'text-yellow-500' : 'text-blue-300';
        iconElement.className = `weather-icon text-8xl ${iconColor} ${iconClass}`;
    }
    
    function updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
        
        // Update every minute to keep time accurate
        setTimeout(updateDate, 60000);
    }
});
