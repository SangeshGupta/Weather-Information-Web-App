const apikey = 'c99f8fef5c53408984b64942232809';
const locationInput = document.getElementById('location');
const getWeatherButton = document.getElementById('get-weather');
const errorMessage = document.getElementById('error-message');
const weatherData = document.getElementById('weather-data');
const celsiusRadio = document.getElementById('celsius');
const fahrenheitRadio = document.getElementById('fahrenheit');
const unitToggle = document.querySelector('.unit-toggle');
const useGeolocationButton = document.getElementById('use-geolocation');

// Function to fetch weather data from the API
function getWeatherData(location, unit) {
    const apiBaseUrl = 'http://api.weatherapi.com/v1/';
    const apiEndpoint = 'current.json';
    const apiUrl = `${apiBaseUrl}${apiEndpoint}?q=${location}&units=${unit}&key=${apikey}`;

    fetch(apiUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            const temperature = data.current.temp_c;
            const humidity = data.current.humidity;
            const windSpeed = data.current.wind_kph;
            const weatherDescription = data.current.condition.text;

            weatherData.innerHTML = `
                <p>Temperature: ${temperature}°</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} km/h</p>
                <p>Weather: ${weatherDescription}</p>
            `;
            errorMessage.textContent = '';
        })
        .catch(error => {
            errorMessage.textContent = 'Weather data not found. Please check the location or try again later.';
            weatherData.innerHTML = '';
        });
}

// Event listener for Celsius and Fahrenheit unit conversion
celsiusRadio.addEventListener('change', () => {
    if (celsiusRadio.checked) {
        getWeatherData(locationInput.value, 'metric'); // 'metric' for Celsius
    }
});

fahrenheitRadio.addEventListener('change', () => {
    if (fahrenheitRadio.checked) {
        getWeatherData(locationInput.value, 'imperial'); // 'imperial' for Fahrenheit
    }
});

// Event listener for "Use My Location" button
useGeolocationButton.addEventListener('click', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const unit = unitToggle.querySelector('input[name="unit"]:checked').value;
            getWeatherData(`${latitude},${longitude}`, unit);
        });
    } else {
        errorMessage.textContent = "Geolocation is not available in your browser.";
    }
});

// Event listener for "Get Weather" button (unchanged)
getWeatherButton.addEventListener('click', () => {
    const location = locationInput.value;
    const unit = unitToggle.querySelector('input[name="unit"]:checked').value;
    getWeatherData(location, unit);
});
