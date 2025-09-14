// Weather Dashboard JavaScript
class WeatherDashboard {
    constructor() {
        // Replace with your OpenWeather API key
        this.apiKey = '88fc109efb12bf1395f076ee2cf968df';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.geoUrl = 'https://api.openweathermap.org/geo/1.0';

        this.initializeElements();
        this.bindEvents();
        this.loadDefaultWeather();
    }

    initializeElements() {
        // DOM elements
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.weatherContainer = document.getElementById('weatherContainer');

        // Weather display elements
        this.cityName = document.getElementById('cityName');
        this.currentDate = document.getElementById('currentDate');
        this.currentTemp = document.getElementById('currentTemp');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherDesc = document.getElementById('weatherDesc');
        this.visibility = document.getElementById('visibility');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.feelsLike = document.getElementById('feelsLike');
        this.forecastContainer = document.getElementById('forecastContainer');
        
        // Modal elements
        this.hourlyModal = document.getElementById('hourlyModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.hourlyContainer = document.getElementById('hourlyContainer');
        this.closeModal = document.getElementById('closeModal');
        
        // Store forecast data for hourly view
        this.forecastData = null;
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.locationBtn.addEventListener('click', () => this.getCurrentLocationWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
        
        // Add event listeners for popular city buttons
        document.querySelectorAll('.city-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const city = e.target.getAttribute('data-city');
                this.cityInput.value = city;
                this.searchWeather();
            });
        });
        
        // Modal event listeners
        this.closeModal.addEventListener('click', () => this.closeHourlyModal());
        this.hourlyModal.addEventListener('click', (e) => {
            if (e.target === this.hourlyModal) {
                this.closeHourlyModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.hourlyModal.style.display === 'block') {
                this.closeHourlyModal();
            }
        });
    }

    async loadDefaultWeather() {
        // Load weather for a default city (Mumbai) if no location is available
        try {
            await this.getCurrentLocationWeather();
        } catch (error) {
            console.log('Geolocation not available, loading default city');
            await this.searchWeatherByCity('Mumbai');
        }
    }

    async getCurrentLocationWeather() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        this.showLoading();

        try {
            const position = await this.getCurrentPosition();
            const { latitude, longitude } = position.coords;
            await this.getWeatherByCoords(latitude, longitude);
        } catch (error) {
            console.error('Geolocation error:', error);
            this.showError('Unable to get your location. Please search for a city manually.');
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            });
        });
    }

    async searchWeather() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name.');
            return;
        }

        this.showLoading();
        await this.searchWeatherByCity(city);
    }

    async searchWeatherByCity(city) {
        try {
            // First get coordinates for the city
            const coords = await this.getCityCoordinates(city);
            if (coords.length === 0) {
                throw new Error('City not found. Please check the spelling and try again.');
            }

            const { lat, lon } = coords[0];
            await this.getWeatherByCoords(lat, lon);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async getCityCoordinates(city) {
        try {
            const url = `${this.geoUrl}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
            console.log('Fetching coordinates for:', city);
            console.log('API URL:', url);
            
            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Coordinates response:', data);
            
            if (!data || data.length === 0) {
                throw new Error(`No coordinates found for "${city}". Please check the city name and try again.`);
            }

            return data;
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your internet connection and try again.');
            }
            throw error;
        }
    }

    async getWeatherByCoords(lat, lon) {
        try {
            const [currentWeather, forecast] = await Promise.all([
                this.fetchCurrentWeather(lat, lon),
                this.fetchForecast(lat, lon)
            ]);

            this.displayCurrentWeather(currentWeather);
            this.displayForecast(forecast);
            this.hideLoading();
            this.showWeatherContainer();
        } catch (error) {
            this.showError('Failed to fetch weather data. Please check your API key and try again.');
        }
    }

    async fetchCurrentWeather(lat, lon) {
        try {
            const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
            console.log('Fetching current weather from:', url);
            
            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Weather API Error:', errorText);
                throw new Error(`Weather API Error: ${response.status} - ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching current weather:', error);
            throw error;
        }
    }

    async fetchForecast(lat, lon) {
        try {
            const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
            console.log('Fetching forecast from:', url);
            
            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Forecast API Error:', errorText);
                throw new Error(`Forecast API Error: ${response.status} - ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching forecast:', error);
            throw error;
        }
    }

    displayCurrentWeather(data) {
        // Update city name and date
        this.cityName.textContent = `${data.name}, ${data.sys.country}`;
        this.currentDate.textContent = this.formatDate(new Date());

        // Update temperature
        this.currentTemp.textContent = Math.round(data.main.temp);

        // Update weather icon and description
        this.updateWeatherIcon(data.weather[0].icon);
        this.weatherDesc.textContent = data.weather[0].description;

        // Update weather details
        this.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        this.humidity.textContent = `${data.main.humidity}%`;
        this.windSpeed.textContent = `${data.wind.speed} m/s`;
        this.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

        // Add animation
        this.weatherContainer.classList.add('weather-update');
        setTimeout(() => {
            this.weatherContainer.classList.remove('weather-update');
        }, 500);
    }

    displayForecast(data) {
        this.forecastContainer.innerHTML = '';
        this.forecastData = data; // Store forecast data for hourly view

        // Get daily forecasts (every 8th item for daily data)
        const dailyForecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

        dailyForecasts.forEach((forecast, index) => {
            const forecastCard = this.createForecastCard(forecast, index);
            this.forecastContainer.appendChild(forecastCard);
        });
    }

    createForecastCard(forecast, index) {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.style.cursor = 'pointer';
        card.title = 'Click to see hourly weather';

        const date = new Date(forecast.dt * 1000);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' });
        const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-date">${dateString}</div>
            <i class="forecast-icon ${this.getWeatherIconClass(forecast.weather[0].icon)}"></i>
            <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
        `;

        // Add click event to show hourly weather
        card.addEventListener('click', () => {
            this.showHourlyWeather(index, dayName, dateString);
        });

        return card;
    }

    updateWeatherIcon(iconCode) {
        this.weatherIcon.className = `weather-icon ${this.getWeatherIconClass(iconCode)}`;
    }

    getWeatherIconClass(iconCode) {
        const iconMap = {
            '01d': 'fas fa-sun',
            '01n': 'fas fa-moon',
            '02d': 'fas fa-cloud-sun',
            '02n': 'fas fa-cloud-moon',
            '03d': 'fas fa-cloud',
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain',
            '10n': 'fas fa-cloud-moon-rain',
            '11d': 'fas fa-bolt',
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',
            '50n': 'fas fa-smog'
        };

        return iconMap[iconCode] || 'fas fa-sun';
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showLoading() {
        this.loadingSpinner.style.display = 'block';
        this.weatherContainer.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }

    hideLoading() {
        this.loadingSpinner.style.display = 'none';
    }

    showWeatherContainer() {
        this.weatherContainer.style.display = 'block';
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.style.display = 'block';
        this.weatherContainer.style.display = 'none';
        this.loadingSpinner.style.display = 'none';
    }

    showHourlyWeather(dayIndex, dayName, dateString) {
        if (!this.forecastData) return;

        // Get hourly data for the selected day (8 hours per day)
        const startIndex = dayIndex * 8;
        const endIndex = startIndex + 8;
        const hourlyData = this.forecastData.list.slice(startIndex, endIndex);

        // Update modal title
        this.modalTitle.textContent = `Hourly Weather - ${dayName}, ${dateString}`;

        // Clear and populate hourly container
        this.hourlyContainer.innerHTML = '';

        hourlyData.forEach((hour, index) => {
            const hourlyCard = this.createHourlyCard(hour, index);
            this.hourlyContainer.appendChild(hourlyCard);
        });

        // Show modal
        this.hourlyModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    createHourlyCard(hourData, index) {
        const card = document.createElement('div');
        card.className = 'hourly-card';

        const date = new Date(hourData.dt * 1000);
        const time = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        // Determine if it will rain
        const isRainy = hourData.weather[0].main.toLowerCase().includes('rain') || 
                       hourData.weather[0].main.toLowerCase().includes('drizzle') ||
                       hourData.weather[0].main.toLowerCase().includes('thunderstorm');

        // Get precipitation probability if available
        const pop = hourData.pop ? Math.round(hourData.pop * 100) : 0;

        card.innerHTML = `
            <div class="rain-indicator ${isRainy ? '' : 'no-rain'}"></div>
            <div class="hourly-time">${time}</div>
            <i class="hourly-icon ${this.getWeatherIconClass(hourData.weather[0].icon)}"></i>
            <div class="hourly-temp">${Math.round(hourData.main.temp)}°C</div>
            <div class="hourly-desc">${hourData.weather[0].description}</div>
            <div class="hourly-details">
                <div class="hourly-detail">
                    <i class="fas fa-tint"></i>
                    <span>${hourData.main.humidity}%</span>
                </div>
                <div class="hourly-detail">
                    <i class="fas fa-wind"></i>
                    <span>${hourData.wind.speed} m/s</span>
                </div>
                <div class="hourly-detail">
                    <i class="fas fa-cloud-rain"></i>
                    <span>${pop}%</span>
                </div>
            </div>
        `;

        return card;
    }

    closeHourlyModal() {
        this.hourlyModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Initialize the weather dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if API key is set
    const dashboard = new WeatherDashboard();

    // Add a warning if API key is not set
    if (dashboard.apiKey === 'YOUR_API_KEY_HERE') {
        dashboard.showError('Please set your OpenWeather API key in the script.js file. Get your free API key from https://openweathermap.org/api');
    } else {
        // Test API key with a simple request
        testApiKey(dashboard.apiKey);
    }
});

// Test function to verify API key is working
async function testApiKey(apiKey) {
    try {
        console.log('🔑 Testing API key:', apiKey);
        console.log('🔑 API key length:', apiKey.length);
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=${apiKey}&units=metric`);
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        
        if (response.ok) {
            console.log('✅ API key is working correctly');
            const data = await response.json();
            console.log('🌤️ Sample weather data:', data);
        } else {
            const errorData = await response.json();
            console.error('❌ API key error:', errorData);
            
            if (errorData.cod === 401) {
                let errorMessage = 'Invalid API key. ';
                if (errorData.message) {
                    errorMessage += `Error: ${errorData.message}`;
                } else {
                    errorMessage += 'Please check your OpenWeather API key and make sure it\'s activated.';
                }
                document.getElementById('errorText').textContent = errorMessage;
                document.getElementById('errorMessage').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('❌ API test failed:', error);
        document.getElementById('errorText').textContent = 'Network error. Please check your internet connection.';
        document.getElementById('errorMessage').style.display = 'block';
    }
}

// Add some utility functions for better user experience
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('cityInput').focus();
        }
    });

    // Add input validation
    const cityInput = document.getElementById('cityInput');
    cityInput.addEventListener('input', (e) => {
        // Remove any special characters except letters, spaces, and hyphens
        e.target.value = e.target.value.replace(/[^a-zA-Z\s-]/g, '');
    });
});

// Manual API key test function (you can call this from browser console)
window.testMyApiKey = async function(apiKey) {
    try {
        console.log('🧪 Testing API key manually...');
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=${apiKey}&units=metric`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ SUCCESS! API key is working');
            console.log('🌤️ Weather data:', data);
            return true;
        } else {
            const error = await response.json();
            console.error('❌ FAILED! API key error:', error);
            return false;
        }
    } catch (error) {
        console.error('❌ Network error:', error);
        return false;
    }
};

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
