.......# Dynamic Weather Dashboard
A beautiful, responsive weather dashboard that provides real-time weather information and 5-day forecasts using the OpenWeather API. Features automatic location detection, city search, and a modern glassmorphism design.

![Weather Dashboard](https://img.shields.io/badge/Weather-Dashboard-blue?style=for-the-badge&logo=weather)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Features

- 🌍 **Real-time Weather Data** - Current weather conditions with temperature, humidity, wind speed, and visibility
- 📍 **Automatic Location Detection** - Uses browser geolocation to show weather for your current location
- 🔍 **City Search** - Search for weather in any city worldwide
- 📅 **5-Day Forecast** - Extended weather forecast with daily predictions
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Beautiful glassmorphism design with smooth animations
- ⚡ **Fast Loading** - Optimized for quick data fetching and display
- 🌙 **Dark Mode Support** - Automatically adapts to system preferences
## File Structure

```
Dynamic Weather Dashboard/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Usage

### Getting Started
1. **Automatic Location**: The dashboard will automatically try to detect your location and show the weather
2. **Manual Search**: Type any city name in the search box and press Enter or click the search button
3. **Current Location**: Click the location button to refresh weather for your current position

### Features Overview
- **Current Weather Card**: Shows temperature, weather conditions, and detailed metrics
- **5-Day Forecast**: Displays upcoming weather with daily predictions
- **Responsive Design**: Automatically adapts to your screen size
- **Error Handling**: Clear error messages for invalid cities or network issues

## API Information

This application uses the OpenWeather API:

- **Current Weather API**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast API**: `https://api.openweathermap.org/data/2.5/forecast`
- **Geocoding API**: `https://api.openweathermap.org/geo/1.0/direct`

### API Limits

- **Free Tier**: 1,000 calls per day
- **Rate Limit**: 60 calls per minute
- **Data Update**: Weather data is updated every 10 minutes

## Customization
### Changing the Default City
To change the default city when geolocation is not available, edit line 25 in `script.js`:

```javascript
await this.searchWeatherByCity('YourCityName');
```

### Modifying the Design

- **Colors**: Edit the CSS variables in `styles.css`
- **Layout**: Modify the grid layouts in the CSS file
- **Animations**: Adjust the keyframe animations for different effects

### Adding New Features

The code is modular and easy to extend. You can add:

- Hourly forecasts
- Weather alerts
- Historical weather data
- Multiple city tracking
- Weather maps integration
## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

1. **"Please set your OpenWeather API key"**
   - Make sure you've replaced `'YOUR_API_KEY_HERE'` with your actual API key

2. **"City not found"**
   - Check the spelling of the city name
   - Try using the full city name with country (e.g., "London, UK")

3. **"Unable to get your location"**
   - Allow location access in your browser
   - Check if your browser supports geolocation
   - Try using the search function instead

4. **CORS Errors**
   - Serve the files through a local server instead of opening directly
   - Use the local server setup instructions above

### API Key Issues

- Ensure your API key is active and not expired
- Check if you've exceeded the daily API limit
- Verify the API key is correctly copied (no extra spaces or characters)

## Contributing

Feel free to contribute to this project by:

1. Forking the repository
2. Creating a feature branch
3. Making your changes
4. Submitting a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Font Awesome](https://fontawesome.com/) for the beautiful icons
- [Google Fonts](https://fonts.google.com/) for the Inter font family

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the OpenWeather API documentation
3. Open an issue in the project repository

---

**Enjoy your weather dashboard! 🌤️**






